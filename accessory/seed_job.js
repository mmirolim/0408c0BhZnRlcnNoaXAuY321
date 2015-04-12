var fivebeans = require('fivebeans');
var beanstalkd_config = require('../beanstalkd_config.js');
var job_config = require('./config/sample_job_config.js');

var client = new fivebeans.client(beanstalkd_config.host, beanstalkd_config.port);

client.on('connect', function(){
	client.use(Array.isArray(beanstalkd_config.tube) ? beanstalkd_config.tube[0] : beanstalkd_config.tube, function(err, tube) {
		if (err) throw err;

		client.put(job_config.priority, job_config.delay, job_config.ttr, JSON.stringify(job_config.job), function(err, jobid){
			if(err) throw err;

			console.log('put job(id: ' + jobid + ') into tube ' + tube);
			client.end();
		})
		
	});
});

client.connect();