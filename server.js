'use strict';
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var app = express();
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(require('./controllers'));

mongoose.Promise = Promise;

var dbURI = process.env.MONGODB_URI || "mongodb://heroku_xklcvtbk:9uqjo64408kcrbg5mjkq0q11p@ds163354.mlab.com:63354/heroku_xklcvtbk";

mongoose.connect(dbURI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

var db = mongoose.connection;

db.on("open", function () {
    console.log("Mongoose connection successful.");
    app.listen(app.get('port'), function () {
        console.log('App listening on PORT ', app.get('port'));
    });
});

module.exports = app;