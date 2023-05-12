require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Instnce of express app
const app = express();

// Use of ejs
app.set("view engine", "ejs");

//Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));

//Creating Database to store articels
mongoose.connect(process.env.DATABASE_URL);

// Schema for database:
wikiSchema = {
  title: String,
  content: String,
};

//Database Model:
const Article = mongoose.model("Article", wikiSchema);

// Using a chainable route parameter: Requests Targetting all articles

app
  .route("/articles")

  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added the article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all the articles");
      } else {
        res.send(err);
      }
    });
  });

// Requests targeting specific articles

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No aritcles matching that title were found");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated the article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted document");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server up and running on port 3000");
});
