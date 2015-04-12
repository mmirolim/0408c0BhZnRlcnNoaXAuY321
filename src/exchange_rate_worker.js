var fivebeans = require('fivebeans');
var util = require('util');
var exchange_rate_handler = require('./exchange_rate_handler.js');
var config = require('./config/worker_config.js');

var FiveBeansWorker = fivebeans.worker;

function ExchangeRateWorker(options){
	var maxSuccTrial = config.max_succ_trial || 10;
	var maxFailTrial = config.max_fail_trial || 3;

	var fivebeans_worker_options = {
		id: options.id || 'Anonymous worker',
		host: options.host,
		port: options.port,
	};

	this.handler = exchange_rate_handler;
	FiveBeansWorker.call(this, fivebeans_worker_options);

	//remove the support of multiple handlers for different types
	this.handlers = undefined;
}

util.inherits(ExchangeRateWorker, FiveBeansWorker);

//rewrite methods runJob
ExchangeRateWorker.prototype.runJob = function(jobID, job){
	var self = this;
	var start = new Date().getTime();

	function putJobBack(delay){
		self.client.put(fivebeans.client.LOWEST_PRIORITY, delay, 60, JSON.stringify(job), function(err, new_job_id){
			if(err) self.emitWarning({ message: 'error putting job back', id: jobID, error: err });
		})
	}

	try{
		self.handler.work(job, function(result, response){
			var elapsed = new Date().getTime() - start;

			self.emit('job.handled', { id: jobID, elapsed: elapsed, result: result });

			switch (result){
				case 'success':
					self.emitInfo('Successfully handled a job: ' + jobID);

					job.succeed_attempt = job.succeed_attempt ? job.succeed_attempt + 1 : 1;
					if(job.succeed_attempt < config.max_succeed_attempt){
						putJobBack(config.succeed_delay);
					}
					self.deleteAndMoveOn(jobID);
					break;

				case 'fail':
					self.emitInfo('Failed to handle a job: ' + jobID);

					job.failed_attempt = job.failed_attempt ? job.failed_attempt + 1 : 1;
					if(job.failed_attempt < config.max_failed_attempt){
						putJobBack(config.failed_delay);
					}
					self.deleteAndMoveOn(jobID);
					break;

				default:
					self.buryAndMoveOn(jobID);
					break;
			}
		});
	}
	catch (e){
		self.emitWarning({ message: 'exception in job handler', id: jobID, error: e });
		self.buryAndMoveOn(jobID);
	}
};

//remove unused functions
ExchangeRateWorker.prototype.callHandler = undefined;
ExchangeRateWorker.prototype.lookupHandler = undefined;

module.exports = ExchangeRateWorker;
