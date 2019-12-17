//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-batyr:8ayaNTDd5AQ4zSw@cluster0-zdgrf.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy food"
});

const item2 = new Item({
  name: "Cook food"
});

const item3 = new Item({
  name: "Eat food"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({}, function(err, results){

    if(results.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err) {
          console.log(err);
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: results});
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (err){
      console.log(err);
    }
  });
  res.redirect("/");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
