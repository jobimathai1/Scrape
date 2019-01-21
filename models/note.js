'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var NoteSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;