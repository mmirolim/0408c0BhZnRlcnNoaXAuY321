#Exchange Rate Worker

##Source

All source codes of the worker is in `src/`

The only support payload syntax by now is `"[from] [to]"`. Please follow if you prefer to seed jobs without my scripts.

##How to use

Install dependencies by `npm install`

**start_worker.js**

Script to start a single worker. Start with command: `node start_worker.js`

**start_multi_workers.js**

Script to start multiple processes of worker concurrently. The minimum number of worker is 2. Start with command: `node start_multi_worker.js [number]`

**add_job.js peek_job.js destroy_job.js**

Assisstance scripts to add, peek, destroy a job in beanstalkd server for easily testing the worker: `node xxxx_job.js`
Please note peek and destroy will only affect ready jobs

**config.js**

Configure file for the module used by above scripts. Default is set as challenge required.
Details description are as below

    {
        //Options used to configure a worker in start_worker.js and start_multi_workers.js
        workerConfig: { 
            host: , //beanstalkd host
            port: , //beanstalkd port
            dbURI: , //database uri
            dbDocName: , //document name in database
            id: , //id to identity this worker (start_multi_workers.js will rewrite this value for each worker)
            maxSuccTrial: , //number of successful jobs to stop
            maxFailTrial: , //number of fail jobs to stop
            succDelay: , //seconds to delay job after successful handling
            failDelay:  //seconds to delay job after fail handling
        },
        tube: , //tube to listen; string for single & array for multiple
       
        //Used for assisstence scripts only. Ignore if you are using other clients
        jobConfig: { //job setting of beanstalkd used in add_job.js
            type: ,
            priority: ,
            delay: ,
            ttr: ,  
        },
        sampleJob: { //sample job to add used in add_job.js
            from: ,
            to: 
        }
    }


 
  