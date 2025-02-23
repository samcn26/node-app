const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const app = express();

// load routers
const ideas = require('./routes/ideas');
const users = require('./routes/users');

require("./config/passport")(passport)

const db = require("./config/database");

// connect to mongodb
mongoose.connect(db.mongoURL,{useNewUrlParser:true})
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

// use static file
app.use(express.static(path.join(__dirname,'public')));

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

// follow session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// 配置全局变量
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // 登陆后操作, 没有返回null
    res.locals.user = req.user || null;
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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})