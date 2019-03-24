const express = require("express")
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

// 路由
const router = express.Router()

// import model
require("../models/User")
const User = mongoose.model('users')
// body-parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// users login & register
router.get("/login", (req, res) => {
    res.render("users/login");
})

router.get("/register", (req, res) => {
    res.render("users/register");
})


router.post("/login", (req, res) => {
    res.render("users/login");
})

router.post("/register", urlencodedParser,(req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({
            text: "password not same"
        })
    }

    if (req.body.password.length < 4) {
        errors.push({
            text: "password length must more than 4 charactors"
        })
    }

    if (errors.length > 0) {
        console.log(errors)
        res.render('users/register',{
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password:req.body.password,
            password2:req.body.password2
        })
    }else{
        User.findOne({
            email:req.body.email
        }).then((user) =>{
            if (user) {
                req.flash("error_msg","email existed")
                res.redirect('/users/register')
            }else{
                const registerInfo = {
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                }
                // saltRounds = 10 密码强度
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(registerInfo.password, salt, (err, hash) => {
                        if (err) throw err;
                        registerInfo.password = hash
                        new User(registerInfo).save()
                        .then(user => {           
                            req.flash("success_msg","register success")
                            res.redirect('/users/login')
                        })
                        .catch(error => {
                            req.flash("error_msg","register failed")
                            res.redirect('/users/register')
                        })
                    });
                });               
            }
        })
    }
})

module.exports = router;