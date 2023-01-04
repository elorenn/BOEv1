const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// Set up code
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------------------------- //

module.exports = app;
