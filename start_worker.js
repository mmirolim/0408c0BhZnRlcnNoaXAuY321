//argument worker ID
var config = require('./config.js');

var rateWorkerFactory = require('./src/rate_worker_factory.js');

if(process.argv[2] != null){
	config.workerConfig.id = process.argv[2];
}

var worker = rateWorkerFactory.createWorker(config.workerConfig);

worker.start([config.tube]);


