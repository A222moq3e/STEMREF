const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
// const htmlPath = path.join(__dirname,'../pages')
// app.use(express.json())
app.set("view engine","ejs")
// app.set("views",htmlPath)
// static files
app.use(express.static('css'))

app.get('/',(req,res)=>{
    res.render("home")
    // res.json({ error: err })

})
app.get('/login',(req,res)=>{
    res.render("login")
})


app.listen(port,()=>{
    console.log('port Connected in',`http://localhost:${port}`);
})