const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const app = express();
// const path = require('path');
const crypto = require('crypto');
const http = require('http');
const {usersCollection, coursesCollection} = require('./config')

const port = process.env.PORT || 3000;
// let accesses  = false;
const hostname = 'localhost';
// const htmlPath = path.join(__dirname,'../pages')
// app.use(express.json())
app.set("view engine","ejs")
// app.set("views",htmlPath)

// Session
app.use(session({
    secret:process.env.SECRET_SESSION || 'some secret',
    cookie: { maxAge : 300000 },
    saveUninitialized: false,
    store : store
}))

// static files
app.use(express.static('css'))
app.use(express.static('imgs'))
app.use(express.static('js'))

// Convert data into json 
app.use(express.json())

app.use(express.urlencoded({extended:false}))

// Creating Server  
app.get('/',(req,res)=>{
    res.render("home",{data:{accesses:req.session.authenticated }})
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
        password: createHash(req.body.password),
        email: req.body.email,
        userType: "user"
    }
    // check if the user already exists
    const userIsExist = await usersCollection.findOne({name: data.name})
    console.log('userIsExist:', userIsExist);
    if(userIsExist){
        res.send("User already exists. Please choos diffrent Name")
    }else{
        // add Data   
        const userdata = await usersCollection.insertMany(data);
        console.log(userdata);
        res.redirect("login")
    }

   
})

app.post('/login',async (req,res)=>{
    console.log('session',req.sessionID);
    console.log('session',req.session.authenticated);
    console.log('session',req.session);
    try {
        const check = await usersCollection.findOne({name:req.body.username})
        if(!check){
            res.send("user not found!");
        }
        if(check.password == createHash(req.body.password)){
            req.session.authenticated =true
            req.session.user = {
                name: req.body.username
            }
            res.redirect('search');
        }else{
            res.send("Password is wrong")
        }
    } catch (error) {
        console.log(error);
        res.send("wrong Details")
    }
})

app.get('/signout',(req,res)=>{
    req.session.authenticated = false;
    res.redirect("/")
})

// Search Page
app.get('/search',async (req,res)=>{
    if(!req.session.authenticated ) res.redirect("/login")
    if(req.query.q){
        const data = await coursesCollection.find({name: req.query.q})
        res.render('search',{data:data})
    }else{
        const data = await coursesCollection.find({})
        res.render('search',{data:data})

    }
    // console.log('coursesCollection',coursesCollection);
})
// Course Page
app.get('/courseContent',async (req,res)=>{
    res.redirect('search')
})
app.get('/courseContent/:name',async (req,res)=>{
    if(!req.session.authenticated ) res.redirect("/login")
    const data = await coursesCollection.findOne({name: req.params.name})
    if(!data)
        res.send('sorry this course not found')
    else{
        res.render('courseContent',{data:{name:req.params.name, desc:data.description, content:data.Content}})
    }
    // res.render('courseContent')
})
app.get('/courseContent/:name/:catogray',async (req,res)=>{
    if(!req.session.authenticated ) res.redirect("/login")
    const data = await coursesCollection.findOne({name: req.params.name})
    // console.log(req.params.catogray);
    let catogray = req.params.catogray;
    // console.log(data.Content[catogray]);
    let urls = data.Content[catogray]
    // console.log(Array.isArray(urls));
    if(!data)
        res.send('sorry this course not found')
    else{
        res.render('courseContent',{data:{name:req.params.name, desc:data.description, content:urls, catogray:catogray}})
    }
    // res.render('courseContent')
})


// Pricing
app.get('/pricing',(req,res)=>{
    res.render("pricing")
})

// small Mehtods
app.get('/addCourse',async (req,res)=>{
    const data= {
        name:"CS205",
        description: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        paidContent: false ,
        Content: {
            "Videos":[{name:"Countonting1",url:"https://www.youtube.com/watch?v=ZcSSI6VY1kM"},
                        {name:"Countonting2",url:"https://www.youtube.com/watch?v=RaDpMKRc3og"} ],
            "Articles":[{name:"Countonting",url:"http://"}],
            "Quizzes":[{name:"Countonting",url:"https://www.youtube.com/watch?v=RaDpMKRc3og"},
                        {name:"Countonting",url:"http://"}],
            "Assignments":[{name:"Countonting",url:"http://"}],
            "Others":[{name:"Countonting5",url:"http://"}],
        }
    }
    const CourseIsExist = await coursesCollection.findOne({name: data.name})
    console.log('CourseIsExist:', CourseIsExist);
    if(CourseIsExist){
        res.send("Course already exists. Please choos diffrent Name")
    }else{
        // add Data   
        const Coursedata = await coursesCollection.insertMany(data);
        res.send("Course Added!")
        console.log(Coursedata);
    }
})

// Port Listner
app.listen(port,()=>{
    console.log('port Connected in',`http://localhost:${port}`);
})




function createHash(password) {
return crypto.createHash('sha256').update(password).digest('hex');
}


// HTTPS in comment
// const fs = require('fs');
// const https = require('https');

// const app = require('express')();
// app.get('*', (req, res) => res.send('<h1>Hello, World</h1>'));

// const server = https.createServer({
//   key: fs.readFileSync(`${__dirname}/localhost-key.pem`, 'utf8'),
//   cert: fs.readFileSync(`${__dirname}/localhost.pem`, 'utf8')
// }, app);

// await server.listen(443);