#Exchange Rate Worker

##How to use

Install dependencies by `npm install`

**start_worker.js**

Script to start a single worker. Start with command: `node start_worker.js`

**start_multi_workers.js**

Script to start multiple processes of worker concurrently. The minimum number of worker is 2. Start with command: `node start_multi_worker.js [number]`

**add_job.js peek_job.js destroy_job.js**

Scripts to add, peek, destroy a job in beanstalkd server for easily testing the worker

**config.js**

Configure file for the module used by above scripts. Default is set as challenge required.

    {
    	workerConfig: {	//Options used to configure a worker in start_worker.js and start_multi_workers.js
    		host: , //beanstalkd host
    		port: , //beanstalkd port
    		dbURI: , //database uri
    		dbDocName: , //document name in database
    		id: , //id to identity this worker (start_multi_workers.js will rewrite this value for each worker)
    		maxSuccTrial: , //number of successful jobs to stop
    		maxFailTrial: , //number of successful jobs to stop
    		succDelay: , //second to delay job after successful handling
    		failDelay:  //second to delay job after fail handling
    	},
    	tube: , //tube to start the 
    
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
    }
  
  