var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var DB_URI = 'mongodb://dataworker:pwd1234@ds041140.mongolab.com:41140/aftershipchallenge3';
//var DOC_NAME = 'ExchangeRate';

var ExchangeRateSchema = new Schema({
	from: String,
	to: String,
	createdAt: { type: Date, default: Date.now },
	rate: String
});


var DBConnection = module.exports= function(opts, callback){
	this.conn = mongoose.createConnection(opts.URI);
	this.ExchangeRate = this.conn.model(opts.docName, ExchangeRateSchema);
};
DBConnection.prototype.onConnect = function(callback){
	this.conn.on('open', function(){
			callback(null);
		})
		.on('error', function(err){
			callback(err);
		});
}

DBConnection.prototype.getModel = function(){
	return this.ExchangeRate;
}
DBConnection.prototype.disconnect = function(){
	return this.conn.close.apply(this.conn, arguments);
}


