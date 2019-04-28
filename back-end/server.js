const express = require("express");
const app = express();
const cors = require("cors");
var wishList = require("./wishList");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({origin: '*'}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var users = require("./users");
var houses = require("./houses");
var reservation = require("./reservation");
var search = require("./search");
app.use("/users", users);
app.use("/houses", houses);
app.use("/reservation", reservation);
app.use("/search", search);
app.use("/wishList", wishList);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
