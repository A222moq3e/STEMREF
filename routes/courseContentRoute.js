const express= require('express')
const router = express.Router();
const controller = require('../controllers/courseContentCont')
const rateLimit = require('express-rate-limit');
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
router.use('/courseContent', (req,res,next)=>{
    console.log('User Enter CourseContent Page Time:', Date.now());
    next()
})

router.get('/courseContent',controller.courseContent)
router.get('/courseContent/:name',controller.courseContentByName)
router.post('/courseContent/:name/stars',controller.courseContentRate)
router.get('/courseContent/:name/:Category',controller.courseContentByNameAndCategory)


module.exports = router ;