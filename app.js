const express = require("express")
var exphbs  = require('express-handlebars');

const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// 配置路由
app.get("/",(req,res) =>{
    const title = "Hello Everybody"
    //render 到具体文件
    res.render("index",{
        title:title
    });   
}) 

app.get("/about",(req,res) =>{
    res.render("about");   
})

// app.get("/test",(req,res) =>{
//     res.render("TEST");   
// })

const port = 5000;

app.listen(port,()=>{
    console.log(`Server started on ${port}`)
})