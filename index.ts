import express = require('express');
import expresshb = require('express-handlebars');

var app = express();

app.engine('handlebars', expresshb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	res.render('home');
});

app.listen(3000);