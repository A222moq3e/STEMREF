const express= require('express')
const router = express.Router();
const controller = require('../controllers/pages')
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
router.get('/search',controller.search)
router.get('/addCourse',controller.addCourse)
router.get('/profile',controller.profile)

// router.get('/',()=>{
//     console.log('in home');
// })

module.exports = router ;