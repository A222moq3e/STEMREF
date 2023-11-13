const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const app = express();
// const path = require('path');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { usersCollection, coursesCollection } = require('../models/config')

//const port = process.env.PORT || 3000; port already specified down uncomment this and comment the down http and https server for localhost
// let accesses  = false;
// const htmlPath = path.join(__dirname,'../pages')
// app.use(express.json())
app.set("view engine","ejs")
// app.set("views",htmlPath)

// Session
app.use(session({
    secret:process.env.SECRET_SESSION || 'some secret',
    cookie: { maxAge : 3000000 },
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


let iconUse = {
    "Videos":"fa-solid fa-circle-play",
    "Articles":"fa-regular fa-newspaper",
    "Quizzes":"fa-solid fa-spell-check",
    "Assignments":"fa-solid fa-pencil",
    "Others":"fa-solid fa-arrow-up-right-from-square",
    "share":"fa-solid fa-share"
}


// Creating Server  
app.get('/',(req,res)=>{  
    console.log('log in home');  
    if(req.session.user)
    res.render("home",{data:{accesses:req.session.authenticated, user:req.session.user}})
    else
    res.render("home",{data:{accesses:req.session.authenticated}})

    // res.json({ error: err })

})
app.get('/login',(req,res)=>{
    if(req.session.authenticated) res.redirect("/search")
    else
    res.render("login")
})
app.get('/register',(req,res)=>{
    if(req.session.authenticated) res.redirect("/search")
    else
    res.render("register")
})
app.post('/register',async (req,res)=>{
    try{
        const data= {
            name:req.body.username,
            password: createHash(req.body.password),
            email: req.body.email,
            userType: "user"
        }
        // check if the user already exists
        const userIsExist = await usersCollection.findOne({name: data.name})
        // console.log('userIsExist:', userIsExist);
        if(userIsExist){
            res.send("User already exists. Please choos diffrent Name")
        }else{
            // add Data   
            const userdata = await usersCollection.insertMany(data);
            console.log(userdata);
            res.redirect("login")
        }
    }catch (error) {
        console.log(error);
        res.send("wrong Details")
    }
   
})

app.post('/login',async (req,res)=>{

    // console.log('session',req.sessionID);
    // console.log('session',req.session.authenticated);
    try {
        const check = await usersCollection.findOne({name:req.body.username})
        console.log(check,'is logging');
        if(!check){
            res.send("user not found!");
        }
        else{
            if(check.password == createHash(req.body.password)){
                req.session.authenticated = true
                req.session.user = {
                    name: req.body.username,
                }
                if(check.userType)req.session.user.userType=check.userType
                // console.log();

                    if(req.session && req.session.user && req.session.user.userType=="educator" ){
                        res.redirect('EducatorDashboard');
                    } else{
                        res.redirect('search')
                    }
            }else{
                res.send("Password is wrong")
            }
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
    // Change this
    if(!req.session.authenticated ) res.redirect("/login")
    console.log(req.session.user);
    if(req.query.q){
        const data = await coursesCollection.find({name: req.query.q})
        res.render('search',{data:data, user:req.session.user})
    }else{
        const data = await coursesCollection.find({})
        res.render('search',{data:data, user:req.session.user})

    }
    // console.log('coursesCollection',coursesCollection);
})
// Course Page
app.get('/courseContent',async (req,res)=>{
    res.redirect('search',{data:{user:req.session.user}})
})
app.get('/courseContent/:name',async (req,res)=>{
    if(!req.session.authenticated ) res.redirect("/login")
    const data = await coursesCollection.findOne({name: req.params.name})
    if(!data)
        res.send('sorry this course not found')
    else{
        res.render('courseContent',{data:{name:req.params.name, desc:data.description, content:data.Content,icons:iconUse,user:req.session.user}})
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
    let urls_filterd = urls.filter((url)=>{
        return url.name != "" ;
    })
    urls = urls_filterd
    console.log('urls:',urls_filterd);
    // console.log(Array.isArray(urls));
    if(!data)
        res.send('sorry this course not found')
    else{
        res.render('courseContent',{data:{name:req.params.name, desc:data.description, content:urls, catogray:catogray,icons:iconUse,user:req.session.user}})
    }
    // res.render('courseContent')
})


// Pricing
app.get('/pricing',(req,res)=>{
    if(!req.session.authenticated ) res.redirect("/login")
    res.render("pricing",{data:{user:req.session.user}})
})

// small Mehtods
app.get('/addCourse',async (req,res)=>{
    const data= {
        name:"CS505",
        description: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        paidContent: false ,
        tags:["Computing", "CS502"],
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
    // console.log('CourseIsExist:', CourseIsExist);
    if(CourseIsExist){
        res.send("Course already exists. Please choos diffrent Name")
    }else{
        // add Data   
        const Coursedata = await coursesCollection.insertMany(data);
        res.send("Course Added!")
        console.log(Coursedata);
    }
})

// User Data
app.get('/profile',(req,res)=>{
    // res.send('hi in profile')
    
    if(req.session && req.session.user){
        res.render('profile',{data:{accesses:req.session.authenticated, user:req.session.user}})
    } else{
        res.redirect('login')
    }
})


app.get('/EducatorDashboard',async (req,res)=>{
    console.log(req.session.user);
    if(req.session && req.session.user && req.session.user.userType=="educator" ){
        res.render('EducatorDashboard',{ user:req.session.user});
    } else{
        res.redirect('login')
    }
})  
app.post('/EducatorDashboard',async (req,res)=>{
    // console.log(req.body);
    let filteredTags = req.body.tags.filter(function (el) {
        return el != null && el != '';
      });
    try{
        const data= {
            name:req.body.CourseName,
            description: req.body.description,
            tags: filteredTags,
            Content: {
                Videos:[],
                Articles:[],
                Quizzes:[],
                Assignments:[],
                Others:[],
            }
        }
        //Videos
        for(let i=0;i<req.body.Video.length;i++){
            if(req.body.Video[i]=='') continue
            let minData ={ name: req.body.Video[i], url:req.body.VideoUrl[i]}
            data.Content.Videos.push(minData)
        }
        //Articles
        for(let i=0;i<req.body.Video.length;i++){
            if(req.body.Video[i]=='') continue
            let minData ={ name: req.body.article[i], url:req.body.articlesUrl[i]}
            data.Content.Articles.push(minData)
        }
        //Quizzes
        for(let i=0;i<req.body.quizzes.length;i++){
            if(req.body.Video[i]=='') continue
            let minData ={ name: req.body.quizzes[i], url:req.body.quizzesUrl[i]}
            data.Content.Quizzes.push(minData)
        }
        //Assignments
        for(let i=0;i<req.body.assignments.length;i++){
            if(req.body.Video[i]=='') continue
            let minData ={ name: req.body.assignments[i], url:req.body.assignmentsUrl[i]}
            data.Content.Assignments.push(minData)
        }
        //Others
        for(let i=0;i<req.body.others.length;i++){
            if(req.body.Video[i]=='') continue
            let minData ={ name: req.body.others[i], url:req.body.othersUrl[i]}
            data.Content.Others.push(minData)
        }
        
        // // check if the user already exists
        const courseIsExist = await coursesCollection.findOne({name: data.name})
        // // console.log('courseIsExist:', courseIsExist);
        if(courseIsExist){
            const coursedata = await coursesCollection.updateOne({name: data.name},data);
            console.log('course Updated:',coursedata);
            // console.log(coursedata);
        }else{
            // add Data   
            const coursedata = await coursesCollection.insertMany(data);
            console.log('course Added:',coursedata);
        }
    }catch (error) {
        console.log(error);
        res.send("wrong Details")
    }
})


function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}



// Port Listner, [Do not remove this]
// app.listen(3005,()=>{
//    console.log('port Connected in',`http://localhost:3005`);
// })



const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/stemref/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/stemref/fullchain.pem', 'utf8')
};

const httpsServer = https.createServer(httpsOptions, app);

// Redirect HTTP to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Start HTTPS and HTTP servers
const HTTPS_PORT = 443;
const HTTP_PORT = 80;

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server listening on port ${HTTP_PORT}`);
});

