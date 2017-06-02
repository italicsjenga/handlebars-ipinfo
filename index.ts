import express = require('express');
import expresshb = require('express-handlebars');
import http = require('http');
import https = require('https');
import promise = require('promise');

import { IPGeoJson } from './ip_geo';

var app = express();

app.engine('handlebars', expresshb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	res.render('home');
	getIpInfo("::ffff:" + "119.17.156.106").country; //replace with req.ip
});

app.listen(3000);

function getIpInfo(ip: String): IPGeoJson {
	var ipinfo: IPGeoJson = {
		ip: "",
		city: "",
		region: "",
		country: "",
		loc: "",
		postal: ""
	};

	var options = {
		host: 'ipinfo.io',
		port: 443,
		path: '/' + ip + '/geo',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}
	console.log(options.path);

	var callback = function (response: http.IncomingMessage) {
		var str: string;

		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			console.log(str);
			ipinfo = <IPGeoJson>JSON.parse(str.slice(9));
			console.log(ipinfo.city);
		});
	}

	https.get(options, callback);

	return ipinfo;
}