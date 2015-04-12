//argument worker ID
var beanstalkd_config = require('./beanstalkd_config.js');

var ExchangeRateWorker = require('./src/exchange_rate_worker.js');

var options = {
	host: beanstalkd_config.host,
	port: beanstalkd_config.port
}

if(process.argv[2] != null){
	options.id = process.argv[2];
}

var worker = new ExchangeRateWorker(options);

worker.on('info', function(info) {
	console.log('[' + info.clientid + '] ' + info.message);
}).on('warning', function(warning) {
	console.log('[' + info.clientid + '] ' + warning.message);
});

Array.isArray(beanstalkd_config.tube) ? worker.start(beanstalkd_config.tube) : worker.start([beanstalkd_config.tube]);




