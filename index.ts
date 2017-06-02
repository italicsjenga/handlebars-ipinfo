import express = require('express');
import expresshb = require('express-handlebars');
import http = require('http');
import https = require('https');
import Promise = require('promise');

import { IPGeoJson } from './ip_geo';

var app = express();

app.engine('handlebars', expresshb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	getIpInfo("::ffff:" + "119.17.156.106").done(function (geoinfo: IPGeoJson) {
		res.render('home');
	}); //replace with req.ip
});

app.listen(3000);

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
				console.log(str);
				resolve(<IPGeoJson>JSON.parse(str.slice(9)));
			});
		}

		https.get(options, callback);
	})
}