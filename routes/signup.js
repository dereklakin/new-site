var express   = require('express');
var site	  = require('../data/site');
var router    = express.Router();
var passport  = require('passport');
require('../config/passport')(passport);

// GET for signup page.
router.get('/', function(req, res, next) {
  res.render('signup', { 
    siteData : site,
    message : req.flash('signupMessage') });
});

// POST for signup form.
router.post('/', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup',
  failureFlash : true
}));

module.exports = router;