console.log("[+]","start index");
// Express Modules
const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

// MISC
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
// i18next modules
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

// routes
const router = require('./routes/routes')
const courseContentRoute = require('./routes/courseContentRoute');

if (process.env.NODE_ENV !== 'production') {
  const envimport = require('dotenv');
  envimport.config();  
}
const secretSessionString = process.env.SECRET_SESSION || "thisisasecret";

const app = express();

// Connect to DB
connectDB();

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
console.log(i18next.t('welcome'))

app.use(i18nextMiddleware.handle(i18next));


console.log("[+]",'process.env.TEST',process.env.TEST);

// Session (using MongoDB store for production)
app.set('trust proxy', 1)
app.use(session({
  secret: secretSessionString,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI|| 'mongodb://localhost:27017/test' ,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,      // 1 day
    secure: process.env.NODE_ENV==='production', // only over HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}))

// Convert data into json 
app.use(express.json())
app.use(express.urlencoded({extended:false}))



// Rate Limit
const limiter  = rateLimit({
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
app.listen(process.env.PORT||3005,()=>{
   console.log('port Connected in',`http://localhost:3005`);
})

