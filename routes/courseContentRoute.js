const express= require('express')
const router = express.Router();
const controller = require('../controllers/courseContentCont')

router.use((req,res,next)=>{
    console.log('Time:', Date.now());
    next()
})

router.get('/courseContent',controller.courseContent)
router.get('/courseContent/:name',controller.courseContentByName)
router.get('/courseContent/:name/:catogray',controller.courseContentByNameAndCatogray)

module.exports = router ;