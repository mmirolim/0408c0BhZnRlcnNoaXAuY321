var fivebeans = require('fivebeans');
var config = require('./config.js');

var client = new fivebeans.client(config.workerConfig.host, config.workerConfig.port);

client.on('connect', function(){
	client.use(config.tube, function(err, tube) {
		if (err) throw err;

		var jobConfig = config.jobConfig;

		var job = {type: jobConfig.type, payload: config.sampleJob.from + ' ' + config.sampleJob.to};

		client.put(jobConfig.priority, jobConfig.delay, jobConfig.ttr, JSON.stringify(job), function(err, jobid){
			if(err) throw err;

			console.log('put job(id: ' + jobid + ', type: ' + jobConfig.type + ') into tube ' + tube);
			client.end();
		})
		
	});
});

client.connect();