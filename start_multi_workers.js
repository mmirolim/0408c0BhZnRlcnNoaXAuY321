var fork = require('child_process').fork;

fork('./start_worker.js',['Worker 1']);
fork('./start_worker.js',['Worker 2']);
fork('./start_worker.js',['Worker 3']);
fork('./start_worker.js',['Worker 4']);