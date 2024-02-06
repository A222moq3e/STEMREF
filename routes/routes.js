const express= require('express')
const router = express.Router();
const controller = require('../controllers/pages')
const controllerForget = require('../controllers/forget')
const controllerAdmin = require('../controllers/adminControllers')
const rateLimit = require('express-rate-limit');
console.log('in routes.js');
// Rate Limit
var limiter  = rateLimit({
    windowMs: 10*60*1000, // 1 hour window
    delayAfter: 10, // begin slowing down responses after the first 10 requests
    delayMs: 100, // slow down subsequent responses by 100 milliseconds per request
    max: 50, // start blocking after 50 requests
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests made from this IP, please try again in a few minutes"
  });
router.use(limiter)
router.use((req,res,next)=>{
    console.log('Time:', Date.now());
    next()
})
// Check if he is not sign in
router.use(['/signout','/search','/profile','/pricing','/EducatorDashboard','/admin','/courseContent'],(req,res,next)=>{
    if(req.session.user && !req.session.user.authenticated) return res.redirect("/login")
    next()
})
// Check Educator
router.use((req,res,next)=>{
  console.log(req.path);
    if(req.session.user&& req.session.user.authenticated && req.session.user.userType == "educator" && req.path!='/EducatorDashboard'&& req.path!='/'&& req.path!='/signout') return res.redirect("/EducatorDashboard")
    next()
})
router.use('/EducatorDashboard',(req,res,next)=>{
  console.log(req.path);
    if(req.session.user.userType != "educator") return res.redirect("/")
    next()
})
router.get('/',controller.index)
router.get('/login',controller.loginGet)
router.post('/login',controller.loginPost)
router.get('/register',controller.registerGet)
router.post('/register',controller.registerPost)
router.get('/forget',controllerForget.forgetGet)
router.post('/forget',controllerForget.forgetPost)
router.get('/reset-password/:token',controllerForget.resetPasswordGet)
router.post('/reset-password/:token',controllerForget.resetPasswordPost)
router.get('/signout',controller.signout)
router.get('/search',controller.search)
router.get('/profile',controller.profile)
router.get('/pricing',controller.pricing)
router.get('/EducatorDashboard',controller.EducatorDashboardGet)
router.post('/EducatorDashboard',controller.EducatorDashboardPost)
router.get('/admin',controllerAdmin.adminGet);
router.post('/admin',controllerAdmin.adminPost);



module.exports = router ;