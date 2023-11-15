const route = require('express').Router();
const controller = require('../controllers/pages')

route.get('/',controller.index)

module.exports=route;