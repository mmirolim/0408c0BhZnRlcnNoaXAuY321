var fivebeans = require('fivebeans');
var beanstalkd_config = require('../beanstalkd_config.js');

var client = new fivebeans.client(beanstalkd_config.host, beanstalkd_config.port);

client.on('connect', function(){
	client.use(Array.isArray(beanstalkd_config.tube) ? beanstalkd_config.tube[0] : beanstalkd_config.tube, function(err, tube) {
		if (err) throw err;

		client.peek_ready(function(err, jobid, payload) {
			if(err) {
				console.log(err);
			}
			else{	
				client.destroy(jobid, function(err) {
					console.log('destroyed job(' + jobid + ')');
				});		

			}
			client.end();
		});
		
	});
});

client.connect();