const express = require("express")
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// 路由
const router = express.Router()

// import model
require("../models/Idea")
const Idea = mongoose.model('ideas')

// body-parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// users login & register
router.get("/login", (req, res) => {
    res.send("login");
})

router.get("/register", (req, res) => {
    res.send("register");
})

module.exports = router;