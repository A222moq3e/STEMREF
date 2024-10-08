console.log("[+]","start index");
const express = require('express');
const session = require('express-session');
const cookieSession  = require('cookie-session')
const store = new session.MemoryStore();
const app = express();
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const router = require('./routes/routes')
const courseContentRoute = require('./routes/courseContentRoute');
const rateLimit = require('express-rate-limit');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');
// const helmet = require('helmet')
// var csurf = require('csurf') deprecated
// const keyPath = '/etc/letsencrypt/live/stemref/privkey.pem'
// const certPath =  '/etc/letsencrypt/live/stemref/fullchain.pem'
const keyPath = "./assets/secretsKeys/privkey.pem"
const certPath =  "./assets/secretsKeys/fullchain.pem"
const secretSessionString = process.env.SECRET_SESSION

// Set EJS as templating engine
app.set("view engine","ejs")

// Add navbar Translator
app.set("navsTranslator",{
  "Home":"/",
  "Dashboard Admin":"/admin",
  "Dashboard Educator":"/EducatorDashboardMain",
  "Search":"/search",
  "Pricing":"/pricing",
  "Insert Course":"/EducatorDashboard"

})

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug:true,
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, './locales/{{lng}}/translation.json')
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie']
    }
  });
console.log(i18next.t('welcom'))

app.use(i18nextMiddleware.handle(i18next));
// // Middleware to pass translation function to templates
// app.use((req, res, next) => {
//   console.log('Current language:', req.language);
//   console.log('Translation function:', req.t('welcome'));
//   if(res.locals.t &&  req.query.lng){
//     res.locals.t = req.t;
//     res.cookie('i18next', req.query.lng)
//   }
//   next();
// });

console.log("[+]",'process.env.TEST',process.env.TEST);

// Session
app.set('trust proxy', 1);
app.use(cookieSession({
    secret:secretSessionString,
    cookie: { 
      maxAge : 24 * 60 * 60 * 1000, // 24 hours
      secure: true, // added 'Secure' attribute
      httpOnly: true, // added 'HttpOnly' attribute to prevent access through client-side script
  },//24 hour
    saveUninitialized: false,
    store : store
}))


// Convert data into json 
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//  TODO: Change logs to winston
// app.use((req,res,next)=>{
//   let nd = new Date();
//   console.log(`[${nd}]:request`);
//   if(req.session) console.log('req session:',req.session);
//   // if (config.RATE_LIMITING_ENABLED === 'true') return res.status(403).send('Forbidden')
//   next()
// })

// Rate Limit
var limiter  = rateLimit({
  windowMs: 10*60*1000, // 1 hour window
  delayAfter: 20, // begin slowing down responses after the first 10 requests
  delayMs: 100, // slow down subsequent responses by 100 milliseconds per request
  max: 100, // start blocking after 50 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests made from this IP, please try again in a few minutes"
});
app.use(limiter);

app.use((req,res,next)=>{
  res.locals.req = req;
  res.locals.navData = {access:false};
  if(req.session?.user)  res.locals.navData = {accesses:req.session.user.authenticated, user:req.session.user,path:'/'+req.path.split('/')[1]}
  next()
})

// Routing
app.use(router)
app.use(courseContentRoute)


// Port Listner, [Do not remove this]
app.listen(3005,()=>{
   console.log('port Connected in',`http://localhost:3005`);
})


// Redirect HTTP to HTTPS
// const httpServer = http.createServer((req, res) => {
//   res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
//   res.end();
// });

// Start HTTPS and HTTP servers
// const HTTPS_PORT = 443;
// const HTTP_PORT = 80;
const HTTPS_PORT = 443;
if(process.env.PROD!="False"){
  const privateKey = fs.readFileSync(keyPath, 'utf8');
  const certificate = fs.readFileSync(certPath, 'utf8');
  const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
  });
}
// // server code 
// const httpsOptions = {
//   key: fs.readFileSync(keyPath, 'utf8'),
//   cert: fs.readFileSync(certPath, 'utf8')
// };

// const httpsServer = https.createServer(httpsOptions, app);
// const HOST =process.env.HOST || "127.0.0.1"
// httpsServer.listen(HTTPS_PORT,() => {
//   console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
//   console.log(`https://${HOST}:${HTTPS_PORT}`);
// });
// // end

// httpServer.listen(HTTP_PORT, () => {
//   console.log(`HTTP server listening on port ${HTTP_PORT}`);
//   console.log(`http://${HOST}:${HTTP_PORT}`);

// });


