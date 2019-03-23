const express = require("express")
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const app = express();

// load routers
const ideas = require('./routes/ideas');
const users = require('./routes/users')

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

// express-session & flash
app.use(session({
    // 密钥
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  }))

app.use(flash())

// 配置全局变量
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

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

// 使用路由
app.use("/ideas",ideas)
app.use("/users",users)

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})