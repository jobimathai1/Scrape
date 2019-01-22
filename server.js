'use strict';
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var PORT = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(require('./controllers'));

mongoose.Promise = Promise;

var dbURI = "mongodb://heroku_xklcvtbk:CARmex0711!@ds163354.mlab.com:63354/heroku_xklcvtbk"|| "mongodb://localhost:27017/news";

mongoose.connect(dbURI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

var db = mongoose.connection;

db.on("open", function () {
    console.log("Mongoose connection successful.");
    app.listen(PORT, function () {
        console.log("App running on port:  " + PORT);
    });
});

module.exports = app;