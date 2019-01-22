'use strict';

var express = require('express');
var app = express();

    app.get('/', function(req, res) {
        res.status(200).send('<a href=\'/api/articles/\'>articles</a><br><a href=\'/api/notes/\'>notes</a>');
    });

app.use('/articles', require('./articles'));
app.use('/notes', require('./notes'));

module.exports = app;