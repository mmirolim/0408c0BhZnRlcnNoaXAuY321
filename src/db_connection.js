var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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


