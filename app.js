require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); //calling the date.js here to use its functions
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public")); // this is to host the css and other static files stored in public folder

app.set("view engine", "ejs");

//mongoDB connection through mongoose
mongoose
  .connect(process.env.SECRET_KEY)
  .then(() => console.log("mongoDb connected")) //if no error
  .catch((err) => console.log("mongoDb error", err)); //if error

//itemsSchema
const itemsSchema = new mongoose.Schema({
  name: String,
});
//SCHEMAAA
const listSchema = new mongoose.Schema({
  name: String,
  item: [itemsSchema],
});
//itemModel
const Item = mongoose.model("Item", itemsSchema);
// listModel
const List = mongoose.model("List", listSchema);

//item creation
const item1 = new Item({
  name: "Welcome to TodoList",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItem = [item1, item2, item3];

//inserting items
// Item.insertMany(defaultItem)
// .then(function () {
//   console.log("Successfully saved default items to DB");
// })
// .catch(function (err) {
//   console.log(err);
// });

// Item.insertMany(defaultItem)
// .then(()=>{
//   console.log("Items added successfully");
// })
// .catch ((err)=>{
//   console.log(err);
// });

//find items

//GET_REQUESTS

app.get("/", function (req, res) {
  if (req.params.custom == "favicon.ico") return; // << add this line to ignore favicon get requests

  const day = date.getDay(); //recalling the function getDay() which is in date.js
  //find items
  Item.find()
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItem)
          .then(function () {
            console.log("Successfully saved default items to DB");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", {
          //to be used by the ejs file
          ListTitle: day,
          BtnTitle: "Work",
          newListItem: foundItems,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


app.get("/about", function (req, res) {
  res.render("about");
});
//custom_page
app.get("/:customListName", function (req, res) {
  const topicID = _.lowerCase(req.params.customListName);

  List.findOne({ name: topicID })
    .then((foundList) => {
      if (!foundList) {
        //create a new list
        const list = new List({
          name: topicID,
          item: defaultItem,
        });
        list.save();
        res.redirect("/" + topicID);
      } else {
        //show existing list
        res.render("list", {
          ListTitle: foundList.name,
          BtnTitle: "Main",
          newListItem: foundList.item,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // const list= new List({
  //   name:topicID,
  //   item:defaultItem
  // })
  // list.save();
});

//POST_REQUESTS
app.post("/", function (req, res) {
  const itemName = req.body.todo1;
  const listName = req.body.button;
  const dayCheck = date.getDay();
  const itemAdd = new Item({
    name: itemName,
  });

  if (listName === dayCheck) {
    itemAdd.save();
    res.redirect("/");
  } 
  else {
    List.findOne({ name: listName })
      .then((foundList) => {
        foundList.item.push(itemAdd);
        console.log(itemAdd);
        foundList.save();
        res.redirect("/" + listName);
      })

      .catch((err) => {
        console.log("the error is "+err);
      });
  }
});


app.post("/delete", function (req, res) {
  const checkeditemID = req.body.checkboxInput; //this will give us the id of item then we can delete that item easily
  const list_NAME = req.body.listNAME;
  const dayTest = date.getDay();

  if (list_NAME == dayTest) {
    Item.deleteOne({ _id: checkeditemID })
      .then(() => {
        console.log("succesfully deleted");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate( 
      {name:list_NAME}, //this will find the list which have name =listname
      {$pull:{item:{_id:checkeditemID}}} //pull will delete the the item which have the id = checkitemID
      )
      .then(function (foundList) {
        res.redirect("/" + list_NAME);
      })
    .catch((err)=>{
      console.log(err);
    })
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});
