const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js"); //calling the date.js here to use its functions

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public")); // this is to host the css and other static files stored in public folder

app.set("view engine", "ejs");
///variable define/////
let items = ["buy food", "cook food", "eat food"];
let Workitems= [];

app.get("/", function (req, res) {
  
  const day = date.getDate(); //recalling the function getdate() which is in date.js
  res.render("list", {  //to use the ejs file 
    ListTitle: day,
    BtnTitle: "Work",
    newListItem: items,
  });
});

app.post("/", function (req, res) {
  let item = req.body.todo1;
  if(req.body.button==="Work")
  {
    Workitems.push(item);
  console.log(Workitems);
  res.redirect("/work");
  }
  else if(req.body.button!="Work")
  {
    items.push(item);
    console.log(item);
    res.redirect("/");
  }
  
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});

app.get("/work", function(req, res)  //app.get for work page
{
  res.render("list" , {ListTitle: "Work", BtnTitle: "Main",newListItem: Workitems});
});

app.post("/work", function (req, res) { //app.post for work page
  let valueee=req.body.workbtn;

  if(valueee==="Work")
  {
    res.redirect("/");
  }
  else
  {
    res.redirect("/work");
  }
  
});

app.get("/about", function(req,res)
{
  res.render("about");
});
