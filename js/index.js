const express = require('express');
const app = express();
const path = require('path');
const collection = require('./config')
const port = 3000;
// const htmlPath = path.join(__dirname,'../pages')
// app.use(express.json())
app.set("view engine","ejs")
// app.set("views",htmlPath)

// static files
app.use(express.static('css'))
app.use(express.static('imgs'))
app.use(express.static('js'))

// Convert data into json 
app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.get('/',(req,res)=>{
    res.render("home")
    // res.json({ error: err })

})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.get('/register',(req,res)=>{
    res.render("register")
})
app.post('/register',async (req,res)=>{
    const data= {
        name:req.body.username,
        password: req.body.password,
        email: req.body.email
    }
    // check if the user already exists
    const userIsExist = await collection.findOne({name: data.name})
    console.log('userIsExist:', userIsExist);
    if(userIsExist){
        res.send("User already exists. Please choos diffrent Name")
    }else{
        // add Data   
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

   
})

app.post('/login',async (req,res)=>{
    try {
        const check = await collection.findOne({name:req.body.username})
        if(!check){
            res.send("user not found!");
        }
        if(check.password == req.body.password){
            res.render('home');
        }else{
            res.send("Password is wrong")
        }
    } catch (error) {
        console.log(error);
        res.send("wrong Details")
    }
})


app.listen(port,()=>{
    console.log('port Connected in',`http://localhost:${port}`);
})