const express = require("express");
const bodyParser = require("body-parser");
const ejs = require ("ejs");
const mongoose = require ("mongoose");

const app = express();

app.set("view engine", 'ejs');


app.use(bodyParser.urlencoded ({
    extended:true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB")

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);



/////////Requests  Targetting all articles\\\\\\\\\\\\\\\\\
app.route("/articles")

.get(function (req, res) {
    Article.find({})
            .then (function (foundArticles){
                res.send(foundArticles)
            });
})

.post(function (req, res) {
    
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save()
})

.delete(function (req, res) {
    Article.deleteMany({})
            .then(function() {
                res.send("Successfully deleted all articles");
            })
            .catch(function(err) {
            res.send("Error deleting articles");
            });
});
/////////Requests  Targetting all articles\\\\\\\\\\\\\\\\\


app.route("/articles/:articleTitle")

.get(function (req, res) {

    Article.find({title: req.params.articleTitle})
            .then (function (foundArticles) {
                res.send(foundArticles)
            })
            .catch (function(err) {
                console.log(err)
                res.send("No articles matching")
            })
})

.put(function (req,res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
        )
            .then(function () {
                res.send("successfully update article")
            })
            .catch (function(err){
                console.log(err)
                res.send("Failed updating article")

            })
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
        )
            .then(function () {
                res.send("successfully update article")
            })
            .catch (function(err){
                res.send("err")
            })
})

.delete(function(req,res) {
    Article.findOneAndDelete(
        {title: req.params.articleTitle},
        )
            .then(function () {
                res.send("successfully deleted article")
            })
            .catch (function(err){
                res.send("err")
            })
});


app.listen(3000, function () {
    console.log("server started on port 3000");
})