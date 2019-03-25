const express = require("express")
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// 路由
const router = express.Router();

const {ensureAuthenticated} = require("../helpers/auth");

// import model
require("../models/Idea")
const Idea = mongoose.model('ideas')

// body-parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// courses
router.get("/", ensureAuthenticated, (req, res) => {
    Idea.find({
        user: req.user.id
    })
    .sort({date:"desc"})
    .then(ideas => {
        res.render("ideas/index",{
            ideas:ideas
        });
    })   
})

// edit  :id
router.get("/edit/:id", ensureAuthenticated, (req, res) => { 
    Idea.findById(req.params.id)
    .then(idea => {
        if (idea.user != req.user.id) {
            // not same user
            req.flash("error_msg", "not same user");
            res.redirect("/ideas");
        }else{
            res.render("ideas/edit",{
                idea:idea
            })
        }       
    })  
    
})

// update
router.put("/:id", ensureAuthenticated, urlencodedParser,(req,res) => {
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then((idea) => {
            req.flash('success_msg',"edit success")
            res.redirect("/ideas")
        })
    })
})

// delete
router.delete("/:id", ensureAuthenticated, (req,res) => {
    // Idea.deleteOne({
    //     _id:req.params.id
    // })
    Idea.remove({
        _id:req.params.id
    })
    .then(() => {
        req.flash('success_msg',"delete success")
        res.redirect("/ideas")
    })
})

// add
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("ideas/add");
})

router.post("/", urlencodedParser, (req, res) => {
    // console.log(req.body);
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: "please add title" })
    } 
    if(!req.body.details){
        errors.push({ text: "please add details" })
    }

    if (errors.length>0){
        res.render("ideas/add",{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });
    }else{
        const newUser = {
            title:req.body.title,
            details:req.body.details,
            user: req.user.id
        }
        new Idea(newUser).save().then(idea =>{
            req.flash('success_msg',"add success")
            res.redirect('/ideas')
        }).catch(err => {
            console.log(err)
        })
    }
})

module.exports = router;