const express = require("express")
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// connect to mongodb
mongoose.connect("mongodb://localhost/node-app")
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

app.get("/ideas/add", (req, res) => {
    res.render("ideas/add");
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
        res.send("ok");
    }
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})