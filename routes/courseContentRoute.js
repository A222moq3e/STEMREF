const express= require('express')
const router = express.Router();
const controller = require('../controllers/courseContentCont')
router.use('/courseContent', (req,res,next)=>{
    console.log('User Enter CourseContent Page Time:', Date.now());
    next()
})

router.get('/courseContent',controller.courseContent)
router.get('/courseContent/:name',controller.courseContentByName)
router.post('/courseContent/:name/stars',controller.courseContentRate)
router.get('/courseContent/:name/:Category',controller.courseContentByNameAndCategory)


module.exports = router ;