'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var Article = require('../../models/article');

// scrape posts from reddit
router.get('/scrape', function (req, res, next) {
    request('https://old.reddit.com/r/aww', function (error, response, html) {
        let $ = cheerio.load(html);
        let results = [];
        $('tr.athing td.title').each(function (i, e) {
            let title = $(this).children('a').text(),
                link = $(this).children('a').attr('href'),
                single = {};
            if (link !== undefined && link.includes('http') && title !== '') {
                single = {
                    title: title,
                    link: link
                };
                // create new article
                let entry = new Article(single);
                // save to database
                entry.save(function (err, doc) {
                    if (err) {
                        if (!err.errors.link) {
                            console.log(err);
                        }
                    } else {
                        console.log('new reddit posts added');
                    }
                });
            }
        });
        next();
    });
}, function (req, res) {
    res.redirect('/');
});

// get all reddit posts from database
router.get('/', function (req, res) {
    Article
        .find({})
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// get all saved reddit posts
router.get('/saved', function (req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// save a reddit post
router.post('/save/:id', function (req, res) {
    Article.findByIdAndUpdate(req.params.id, {
        $set: { saved: true }
    },
        { new: true },
        function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

module.exports = router;