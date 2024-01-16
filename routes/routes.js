const express= require('express')
const router = express.Router();
const controller = require('../controllers/pages')
const controllerForget = require('../controllers/forget')
console.log('in routes.js');
router.use((req,res,next)=>{
    console.log('Time:', Date.now());
    next()
})
router.get('/',controller.index)
router.get('/login',controller.loginGet)
router.post('/login',controller.loginPost)
router.get('/register',controller.registerGet)
router.post('/register',controller.registerPost)
router.get('/forget',controllerForget.forgetGet)
router.get('/signout',controller.signout)
router.get('/search',controller.search)
router.get('/profile',controller.profile)
router.get('/pricing',controller.pricing)
router.get('/EducatorDashboard',controller.EducatorDashboardGet)
router.post('/EducatorDashboard',controller.EducatorDashboardPost)


module.exports = router ;