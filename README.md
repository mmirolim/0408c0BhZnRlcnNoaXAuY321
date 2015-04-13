#Exchange Rate Worker

##Target job format

The support job payload syntax by now is

    {
      from: "from",
      to: "to"
    }`

Please follow if you prefer to seed jobs without my scripts. Otherwise, your jobs will be buried.

##How to use

Install dependencies by `npm install`

**beanstalkd_config.js**

The configure file of beanstalkd server resources including: host, port and tube(s).

The default is set as the challenge required.

**start_worker.js**

Script to start a single worker. Start with command: `node start_worker.js [worker_name]`

If `worker_name` is not specified, the default id is `Anonymous worker`

**start_multi_workers.js**

Script to start multiple processes of worker concurrently. The minimum number of worker is 2. Start with command: `node start_multi_worker.js [number]`

If `number` is not specified, the default is the minimum number. The workers will be named as `Worker [index]`

##Source

All source codes of the worker is in `src/`. You can also embed the worker constructor through requiring `exchange_rate_worker.js` to create your own worker instead of using my start scripts. The ExchangeRateWorker extends FiveBeansWorker.

**constructor**

    new ExchangeRateWorker(options)

return a new exchange rate worker object. Options should contain following keys:

    {
      id: , //optional; how this worker should identify itself in log events
      host: , //beanstalkd host
      port: , //beanstalkd port
    }

**event**

Succeed or failed attempt to handle an job will also publish `info` event.

**config**

`config/` contains the configuration file to set the worker's target database sourse and behaviors: number of attempts & delay intervals. The default is set as challenge required.


##Accessory

`accessory/` contains scripts to modify the jobs in beanstalkd which help to check the behaviors of the worker.

**seed_job.js peek_job.js destroy_job.js**

Scripts to put, peek, destroy a job in beanstalkd server, used by: `node xxxx_job.js`
Please note peek and destroy will only affect ready jobs. If you have specifeid tubes array in `beanstald_config.js` file, these scripts will only act on the first element.

**config/**

Contains the configure file for the sample job used by `seed_job.js`.


 
  