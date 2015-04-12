var events = require('events');
var util = require('util');
var request = require('request');
var exhcnage_rate_model = require('./exchange_rate_model.js');

var from_parse_regex = /class="leftCol">1\.00&nbsp;<span class="uccResCde">([A-Za-z]*)<\/span>/i;
var to_parse_regex = /class="rightCol">(.*)&nbsp;<span class="uccResCde">([A-Za-z]*)<\/span>/i;

function getRequestURL(from, to){
	return 'http://www.xe.com/currencyconverter/convert/?Amount=1&From=' + from + '&To=' + to;
}

exports.work = function(job, callback){
	var that = this;

	if(!job || !job.from || !job.to){
		callback('fail', new Error('Invalid job format'));
		return;		
	}

	request(getRequestURL(job.from, job.to), function (err, response, body) {
		if(err || response.statusCode !== 200){
			callback('fail', new Error('Failed to request from xe.com'));
			return;
		}

		var from_matches = from_parse_regex.exec(body);
		var to_matches = to_parse_regex.exec(body);
		
		if(!from_matches || !to_matches){
			callback('fail', new Error('Invalid response from xe.com'));
			return;			
		}

		var rate = parseFloat(to_matches[1]);

		if(from_matches[1] === job.from && to_matches[2] === job.to && rate !== NaN){
			exhcnage_rate_model.create({
				from: job.from,
				to: job.to,
				rate: rate.toFixed(2) + ''
			}, function(err, exchange_rate){
				if(err){
					fail('fail', err);
					return;						
				}

				callback('success', exchange_rate);		
			});
		}
		else{
			callback('fail', new Error('Invalid response from xe.com'));
			return;				
		}
	});
}
