var fivebeans = require('fivebeans');
var config = require('../config.js');
var RateHandler = require('./rate_handler.js');
var DBConnection = require('./db_connection.js');

exports.createWorker = function(config){
	var succTrial = 0;
	var failTrial = 0;

	var maxSuccTrial = config.maxSuccTrial || 10;
	var maxFailTrial = config.maxFailTrial || 3;

	var workerId = config.id || 'Anonymous worker';

	var dbConnection = new DBConnection({
		URI: config.dbURI,
		docName: config.dbDocName
	});

	var rateHandler = new RateHandler({
		succDelay: config.succDelay || 60,
		failDelay: config.failDelay || 3,
		exchangeRateModel: dbConnection.getModel()
	});

	var rateWorkerOpts = {
		id: config.id,
		host: config.host,
		port: config.port,
		handlers: {
			rate: rateHandler
		}
	}

	rateWorker = new fivebeans.worker(rateWorkerOpts);	

	dbConnection.onConnect(function(err){
		if(err) throw err;
		console.log('[' + workerId + '] has connected to db');
	})

	rateWorker.on('started', function(){
		console.log('[' + workerId + '] has started');
	}).on('error', function(err){
		console.log('[' + workerId + '] has errors: ' + err);
	}).on('stopped', function(){
		console.log('[' + workerId + '] has stopped');
		dbConnection.disconnect(function(err){
			if(err) throw err;
			console.log('[' + workerId + '] has disconnected from db')
		});
	});

	rateHandler.on('success', function(exchangeRate){
		console.log('[' + workerId + '] has successfully handled a job:\n' + exchangeRate);

		if(++succTrial >= maxSuccTrial) rateWorker.stop();
	}).on('fail', function(reason){
		console.log('[' + workerId + '] has failed to handle a job since:\n' + reason);

		if(++failTrial >= maxFailTrial) rateWorker.stop();
	});

	return rateWorker;
}


