"use strict";

var express = require("express");
var app = express();
var axios = require("axios");
var cheerio = require("cheerio");
var Article = require("../../models/article");


// get all reddit posts from database
app.get("/", function(req, res) {
  Article.find({}).exec(function(error, docs) {
    if (error) {
      console.log(error);
      res.status(500);
    } else {
      res.status(200).json(docs);
    }
  });
});

// get all saved reddit posts
app.get("/saved", function(req, res) {
  Article.find({})
    .where("saved")
    .equals(true)
    .where("deleted")
    .equals(false)
    .populate("notes")
    .exec(function(error, docs) {
      if (error) {
        console.log(error);
        res.status(500);
      } else {
        res.status(200).json(docs);
      }
    });
});

// save a reddit post
app.post("/save/:id", function(req, res) {
  Article.findByIdAndUpdate(
    req.params.id,
    {
      $set: { saved: true }
    },
    { new: true },
    function(error, doc) {
      if (error) {
        console.log(error);
        res.status(500);
      } else {
        res.redirect("/");
      }
    }
  );
});

// scrape posts from reddit
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Return to homepage
      res.redirect("/");
    });
  });

module.exports = app;
