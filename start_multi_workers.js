var fork = require('child_process').fork;

var num = process.argv[2] > 1 ? process.argv[2] : 2;

for(var i = 0; i < num; i++){
	fork('./start_worker.js',['Worker ' + i]);	
}
