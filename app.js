const express = require("express")
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const app = express();

// connect to mongodb
mongoose.connect("mongodb://localhost/node-app",{useNewUrlParser:true})
.then(()=>{
    console.log("Mongodb connected")
})
.catch(err => {
    console.log(err)
})

// import model
require("./models/Idea")

const Idea = mongoose.model('ideas')

// body-parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// method-override
app.use(methodOverride('_method'))

// 配置路由
app.get("/", (req, res) => {
    const title = "Hello Everybody"
    //render 到具体文件
    res.render("index", {
        title: title
    });
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.get("/ideas", (req, res) => {
    Idea.find({})
    .sort({date:"desc"})
    .then(ideas => {
        res.render("ideas/index",{
            ideas:ideas
        });
    })   
})

// add
app.get("/ideas/add", (req, res) => {
    res.render("ideas/add");
})

// edit  :id
app.get("/ideas/edit/:id", (req, res) => { 
    Idea.findById(req.params.id)
    .then(idea => {
        res.render("ideas/edit",{
            idea:idea
        })
    })  
    
})

// update
app.put("/ideas/:id",urlencodedParser,(req,res) => {
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then((idea) => {
            res.redirect("/ideas")
        })
    })
})

// delete
app.delete("/ideas/:id",(req,res) => {
    // Idea.deleteOne({
    //     _id:req.params.id
    // })
    Idea.remove({
        _id:req.params.id
    })
    .then(() => {
        res.redirect("/ideas")
    })
})

app.post("/ideas", urlencodedParser, (req, res) => {
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
            details:req.body.details
        }
        new Idea(newUser).save().then(idea =>{
            res.redirect('/ideas')
        }).catch(err => {
            console.log(err)
        })
    }
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})