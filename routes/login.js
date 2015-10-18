var auth        = require('./authentication');
var site		= require('../data/site');
var express     = require('express');
var router      = express.Router();
var passport    = require('passport');
require('../config/passport')(passport);

// GET for the login page.
router.get('/', function(req, res, next) {
  res.render('login', { 
	  siteData: site, 
	  message : req.flash('loginMessage') });
});

// POST for the login page.
router.post('/', 
    passport.authenticate('local-login', {
        failureRedirect : '/login',
        failureFlash : true
    }),
    auth.issueCookie,
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;