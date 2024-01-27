const express = require('express');
const session = require('express-session');
const cookieSession  = require('cookie-session')
const store = new session.MemoryStore();
const app = express();
// const path = require('path');
console.log('start index');
const http = require('http');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const router = require('../routes/routes')
const courseContentRoute = require('../routes/courseContentRoute');
// require("dotenv").config();
// const keyPath = '/etc/letsencrypt/live/stemref/privkey.pem'
// const certPath =  '/etc/letsencrypt/live/stemref/fullchain.pem'
const keyPath = "./assets/secretsKeys/privkey.pem"
const certPath =  "./assets/secretsKeys/fullchain.pem"

//const port = process.env.PORT || 3000; port already specified down uncomment this and comment the down http and https server for localhost
// let accesses  = false;
// const htmlPath = path.join(__dirname,'../pages')
// app.use(express.json())
app.set("view engine","ejs")
// app.set("views",htmlPath)
console.log('process.env.TEST');
console.log(process.env.TEST);
// Session
app.set('trust proxy', 1);
app.use(cookieSession({
    secret:process.env.SECRET_SESSION || 'some secret',
    cookie: { maxAge : 24 * 60 * 60 * 1000 },//24 hour
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

// logs
app.use((req,res,next)=>{
  let nd = new Date();
  console.log(`[${nd}]:request`);
  if(req.session) console.log('req session:',req.session);
  next()
})

let iconUse = {
    "Videos":"fa-solid fa-circle-play",
    "Articles":"fa-regular fa-newspaper",
    "Quizzes":"fa-solid fa-spell-check",
    "Assignments":"fa-solid fa-pencil",
    "Others":"fa-solid fa-arrow-up-right-from-square",
    "share":"fa-solid fa-share"
}

// Creating Server  
// app.use('/',router)
// app.use('/login',router)
// app.use('/register',router)
// app.use('/signout',router)
// app.use('/search',router)
// app.use('/courseContent',router)
// app.use('/pricing',router)
// app.use('/profile',router)
// app.use('/EducatorDashboard',router)
app.use(router)
app.use(courseContentRoute)

app.get('/test',(req,res)=>{
  res.send('Welcom in STEMREF')
})
// Port Listner, [Do not remove this]
// app.listen(3005,()=>{
//    console.log('port Connected in',`http://localhost:3005`);
// })



const httpsOptions = {
  key: fs.readFileSync(keyPath, 'utf8'),
  cert: fs.readFileSync(certPath, 'utf8')
};

const httpsServer = https.createServer(httpsOptions, app);

// Redirect HTTP to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Start HTTPS and HTTP servers
// const HTTPS_PORT = 443;
// const HTTP_PORT = 80;
const HTTPS_PORT = 3443;
const HTTP_PORT = 3005;
// const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
// const HTTP_PORT = process.env.HTTP_PORT || 3005;
const HOST =process.env.HOST || "127.0.0.1"
httpsServer.listen(HTTPS_PORT,() => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
  console.log(`https://${HOST}:${HTTPS_PORT}`);
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server listening on port ${HTTP_PORT}`);
  console.log(`http://${HOST}:${HTTP_PORT}`);

});
