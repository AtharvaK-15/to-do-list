const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();

var items=["Web Development"];
var WorkItems=[];
    
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

// created a public file and moved css folder into it and then called into website through express.
app.use(express.static("public"));

app.get("/",function(req,res){
    let today = new Date();
    
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US",options);

        // list file should be in a file named views
    res.render("list",{ListTitle: day, newListItems: items});
})

app.post("/",function(req,res){
    let item = req.body.newItem;
   
    if (req.body.list === "Work") {
        WorkItems.push(item);
        res.redirect("/work")

    } 
        else {
            items.push(item);
            res.redirect("/");
    }

})

// WORK PAGE
app.get("/work",function(req,res){
    res.render("list",{ListTitle: "Work List", newListItems: WorkItems})
})

app.post("/work",function(req,res){
    let item = req.body.newItem;
    WorkItems.push(item);
    res.redirect("/work");
})

app.listen(port,function(req,res){
        console.log("Server is running on port 3000.");
})
