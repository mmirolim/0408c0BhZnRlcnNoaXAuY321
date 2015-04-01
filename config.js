//Payload format: '[from] [to]'
module.exports = {
	workerConfig: {	
		host: 'challenge.aftership.net',
		port: 11300,
		dbURI: 'mongodb://dataworker:pwd1234@ds041140.mongolab.com:41140/aftershipchallenge3',
		dbDocName: 'ExchangeRate',
		id: 'Anonymous worker',
		maxSuccTrial: 10,
		maxFailTrial: 3,
		succDelay: 60,
		failDelay: 3
	},
	tube: 'yangaobo',

	//not used for worker; put here to add job for test
	jobConfig: {
		type: 'rate',
		priority: 0,
		delay: 0,
		ttr: 60,	
	},
	sampleJob: {
		from: 'HKD',
		to: 'USD'
	}
};