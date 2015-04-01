var fivebeans = require('fivebeans');
var config = require('./config.js');


var client = new fivebeans.client(config.workerConfig.host, config.workerConfig.port);

client.on('connect', function(){
	client.use(config.tube, function(err, tube) {
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