const express= require('express')
const router = express.Router();
const controller = require('../controllers/pages')
// const controllerForget = require('../controllers/forget')
const controllerAuth = require('../controllers/auth')
const controllerAdmin = require('../controllers/adminControllers')


// for Login and Register Pages
function checkUserLogin(req,res,next){
  if(req.session.user && req.session.user.authenticated) return res.redirect("/search")
  next()
}



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
    if(req.session.user.userType != "educator") return res.redirect("/")
    next()
})
router.use('/admin',(req,res,next)=>{
    if(req.session.user.userType != "admin") return res.redirect("/")
    next()
})
router.get('/',controller.index)
router.get('/login',checkUserLogin,controllerAuth.loginGet)
router.post('/login',checkUserLogin,controllerAuth.loginPost)
router.get('/register',checkUserLogin,controllerAuth.registerGet)
router.post('/register',checkUserLogin,controllerAuth.registerPost)
router.get('/signout',controllerAuth.signout)
// router.get('/forget',controllerForget.forgetGet)
// router.post('/forget',controllerForget.forgetPost)
// router.get('/reset-password/:token',controllerForget.resetPasswordGet)
// router.post('/reset-password/:token',controllerForget.resetPasswordPost)
router.get('/search',controller.search)
router.get('/profile',controller.profile)
router.get('/pricing',controller.pricing)
router.get('/EducatorDashboard',controller.EducatorDashboardGet)
router.post('/EducatorDashboard',controller.EducatorDashboardPost)
router.get('/admin',controllerAdmin.adminGet);
router.post('/admin',controllerAdmin.adminPost);
router.put('/admin/:user/userType/:userType',controllerAdmin.adminPut);





module.exports = router ;