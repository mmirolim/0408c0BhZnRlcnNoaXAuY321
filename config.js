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

	//Used for assisstence scripts only. Ignore if you are using other clients
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