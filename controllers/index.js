'use strict';

var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');

// Route
router.get('/', function (req, res) {
    Article
        .find({})
        .where('saved').equals(false)
        .where('deleted').equals(false)
        .sort('-date')
        .limit(20)
        .exec(function (error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let hbsObj = {
                    title: 'Scraping echoJS',
                    subtitle: 'The echoJS Scrapper',
                    articles: articles
                };
                res.render('index', hbsObj);
            }
        });
});

// Route to saved reddit posts
router.get('/saved', function (req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .sort('-date')
        .exec(function (error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                var hbsObj = {
                    title: 'Posts from Reddit',
                    subtitle: 'The Old Reddit News',
                    articles: articles
                };
                res.render('saved', hbsObj);
            }
        });
});

router.use('/api', require('./api'));
module.exports = router;