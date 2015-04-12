var mongoose = require('mongoose');
var config = require('./config/db_config.js')

var Schema = mongoose.Schema;

var exchange_rate_schema = new Schema({
	from: String,
	to: String,
	created_at: { type: Date, default: Date.now },
	rate: String
}, {collection: config.collection_name});

mongoose.connect(config.db_uri);

mongoose.connection.on('open', function(){
	
})
.on('error', function(err){
	throw err;
});

module.exports = mongoose.model(config.collection_name, exchange_rate_schema)


