const express = require('express');
const router = express.Router();
const controller = require('../controllers/pages');
const controllerAuth = require('../controllers/auth');
const controllerAdmin = require('../controllers/adminControllers');

// Authentication and Authorization Middlewares
function isAuthenticated(req, res, next) {
  if (!req.session.user || !req.session.user.authenticated) {
    return res.redirect('/login');
  }
  next();
}

function isNotAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.authenticated) {
    return res.redirect('/search');
  }
  next();
}

function isEducator(req, res, next) {
  if (!req.session.user || req.session.user.userType !== 'educator') {
    return res.redirect('/');
  }
  next();
}

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.userType !== 'admin') {
    return res.redirect('/');
  }
  next();
}

router.get('/', controller.index);
router.get('/login', isNotAuthenticated, controllerAuth.loginGet);
router.post('/login', isNotAuthenticated, controllerAuth.loginPost);
router.get('/register', isNotAuthenticated, controllerAuth.registerGet);
router.post('/register', isNotAuthenticated, controllerAuth.registerPost);
router.get('/signout', isAuthenticated, controllerAuth.signout);
router.get('/search', isAuthenticated, controller.search);
router.get('/profile', isAuthenticated, controller.profile);
router.get('/pricing', isAuthenticated, controller.pricing);
router.get('/EducatorDashboard', isAuthenticated, isEducator, controller.EducatorDashboardGet);
router.post('/EducatorDashboard', isAuthenticated, isEducator, controller.EducatorDashboardPost);
router.get('/admin', isAuthenticated, isAdmin, controllerAdmin.adminGet);
router.post('/admin', isAuthenticated, isAdmin, controllerAdmin.adminPost);
router.put('/admin/:user/userType/:userType', isAuthenticated, isAdmin, controllerAdmin.adminPut);

module.exports = router;