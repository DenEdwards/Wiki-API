const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article",articleSchema);

//////////////////////////Requests targeting all articles/////////////////////////////////

app.route("/articles")
  .get(function(req,res){
    Article.find({},function(err,foundArticles){
      if(!err){
        res.send(foundArticles)
      }else{
        res.send(err)
      }
    })
  })
  .post(function(req,res){
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save(function(err){
      if(!err){
        res.send("Entry Successful!")
      }else{
        res.send(err)
      }
    })
  })
  .delete(function(req,res){
    Article.deleteMany({},function(err){
      if(!err){
        res.send("Delete Many Successful!");
      }else{
        res.send(err)
      }
    })
  });

  //////////////////////////Requests targeting specific articles/////////////////////////////////
app.route("/articles/:articleTitle")
  .get(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.findOne({title: articleTitle},function(err,foundArticle){
      if(!err){
        if(foundArticle){
          res.send(foundArticle);
        }else{
          res.send("No article by that name was found!");
        }
      }else{
        res.send(err);
      }
    });
  })
  .put(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.updateOne(
      {title: articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Update Successful");
        }else{
          res.send(err);
        }
      });
  })
  .patch(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.updateOne(
      {title: articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Update Successful");
        }else{
          res.send(err);
        }
      });
  })
  .delete(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.deleteOne({title: articleTitle},function(err){
      if(!err){
        res.send("Delete Successful!");
      }else{
        res.send(err)
      }
    })
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
