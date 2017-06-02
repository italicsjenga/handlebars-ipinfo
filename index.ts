import express = require('express');
import expresshb = require('express-handlebars');
import http = require('http');
import https = require('https');
import Promise = require('promise');
import HashMap = require('hashmap');

import { IPGeoJson } from './ip_geo';

var app = express();
var cache = new HashMap();

app.engine('handlebars', expresshb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.enable('trust-proxy');

app.get('/', function (req, res) {
	getIpInfo(req.ips[0]).done(function (geoinfo: IPGeoJson) {
		console.log("ip: " + geoinfo.ip);
		console.log("ips[0]: " + req.ips[0]);
		res.render('home', {
			helpers: {
				ip: function () { return geoinfo.ip; },
				city: function () { return geoinfo.city; },
				region: function () { return geoinfo.region; },
				country: function () { return geoinfo.country; },
				loc: function () { return geoinfo.loc; },
				postal: function () { return geoinfo.postal }
			}
		});
	}); //replace with req.ip
});

app.listen(3000, 'localhost');

function getIpInfo(ip: String): Promise.IThenable<{}> {
	return new Promise(function (resolve, reject) {
		var options = {
			host: 'ipinfo.io',
			port: 443,
			path: '/' + ip + '/geo',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}

		var callback = function (response: http.IncomingMessage) {
			var str: string;

			response.on('data', function (chunk) {
				str += chunk;
			});

			response.on('end', function () {
				var result = <IPGeoJson>JSON.parse(str.slice(9));
				cache.set(ip, result);
				resolve(result);
			});
		}

		var cached = cache.get(ip);
		if (cached != null) {
			console.log("serving cached");
			resolve(cached);
		} else {
			console.log("serving fetched");
			https.get(options, callback);
		}
	})
}