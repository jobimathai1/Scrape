'use strict';

var express = require('express');
var app = express();
var Article = require('../../models/article');
var Note = require('../../models/note.js');

// get all notes from database
app.get('/', function(req, res) {
    Note
        .find({})
        .exec(function(err, notes) {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                res.status(200).json(notes);
            }
        });
});

// Add a note to save article
app.post('/:id', function(req, res) {
    let newNote = new Note(req.body);
    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { 'notes': doc.id } },
                function(error, newDoc) {
                    if (error) {
                        console.log(error);
                        res.status(500);
                    } else {
                        res.redirect('/saved');
                    }
                }
            );
        }
    });
});

module.exports = app;