const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
  name: String,
};

// mongoose model after creating the schema
const Item = mongoose.model("Item", itemSchema);

// Creating two new default items through mongoose
const item1 = new Item({
  name: "Welcome to your todolist",
});
const item2 = new Item({
  name: "Hit the + button to add a new task on your list.",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

// mongoose model after creating listschema
const List = mongoose.model("List",listSchema);

// created a file called public and moved css folder into it and then called into website through express.
app.use(express.static("public"));

app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  Item.find({}, function (err, FoundItems) {
    if (FoundItems.length === 0) {
      Item.insertMany(defaultItem, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.render("/");
    } 
    else {
      res.render("list", { ListTitle: day, newListItems: FoundItems });
    }
  });
});

// customelistname is whatever user enters after the forward slash
app.get("/:customlistname",function(req,res){
  const customName =  req.params.customlistname;

  List.findOne({name:customName},function(err,FoundItems){
    if (!err) {
      if(!FoundItems){
        // Create a new list
        const list = new List({
          name: customName,
          items: defaultItem
        });
          res.redirect("/"+customName); 
    list.save();
      }else{
        // Show an existing list
        res.render("list", { ListTitle: FoundItems.name, newListItems: FoundItems.items });
      }
    }
  })
  

});


app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");

  // if (req.body.list === "Work") {
  //   WorkItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete",function(req,res){
  const checkedItemId = Object.keys(req.body)[0];
  console.log(checkedItemId)
  Item.findByIdAndRemove(checkedItemId,function(err){
    if (!err) {
      console.log("Successfully deleted checked item from the list");
      res.redirect("/");
    }
  });
});



app.listen(port, function (req, res) {
  console.log("Server is running on port 3000.");
});
