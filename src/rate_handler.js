var events = require('events');
var util = require('util');
var request = require('request');


var fromParseRegex = /class="leftCol">1\.00&nbsp;<span class="uccResCde">([A-Za-z]*)<\/span>/i;
var toParseRegex = /class="rightCol">(.*)&nbsp;<span class="uccResCde">([A-Za-z]*)<\/span>/i;

var RateHandler = module.exports = function(opts){
	events.EventEmitter.call(this);
	this.succDelay = opts.succDelay;
	this.failDelay = opts.failDelay;
	this.exchangeRateModel = opts.exchangeRateModel;
	this.type = 'rate';
}

util.inherits(RateHandler, events.EventEmitter);

RateHandler.prototype.work = function(payload, callback){
	var that = this;
	
	function fail(reason){
		callback('release', that.failDelay);
		that.emit('fail', reason);
	}

	if(payload === null){
		fail(new Error('Invalid payload: ' + payload));
		return;
	}

	var payloadArray = parsePayload(payload);

	if(payloadArray.length < 2){
		fail(new Error('Invalid payload: ' + payload));
		return;		
	}

	var from = payloadArray[0];
	var to = payloadArray[1];

	request(getRequestURL(from, to), function (err, response, body) {
		if(err){
			fail(err);
			return;
		}

		if(response.statusCode !== 200){
			fail(new Error('Http request failed with code: ' + response.statusCode));
			return;			
		}

		var fromMatches = fromParseRegex.exec(body);
		var toMatches = toParseRegex.exec(body);
		
		var rate = parseFloat(toMatches[1]);

		if(fromMatches[1] === from && toMatches[2] === to && rate !== NaN){
			that.exchangeRateModel.create({
				from: from,
				to: to,
				rate: rate.toFixed(2) + ''
			}, function(err, exchangeRate){
				if(err){
					fail(err);
					return;						
				}

				callback('release', that.succDelay);
				that.emit('success', exchangeRate);			
			});
		}
		else{
			fail(new Error('Cannot get exchange rate from xu.com: ' + from + ' to ' + to));
			return;				
		}

	});
}

function parsePayload(payload){
	return payload.split(' ');
}

function getRequestURL(from, to){
	return 'http://www.xe.com/currencyconverter/convert/?Amount=1&From=' + from + '&To=' + to;
}
