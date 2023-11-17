const express= require('express')
const router = express.Router();
const controller = require('../controllers/pages')
console.log('in routes.js');
router.use((req,res,next)=>{
    console.log('Time:', Date.now());
    next()
})
router.get('/',controller.index)
// router.get('/',()=>{
//     console.log('in home');
// })

module.exports = router ;