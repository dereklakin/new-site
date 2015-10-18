var auth    = require('./authentication');
var site    = require('../data/site');
var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', 
  auth.verifyAuthenticated,
  function(req, res) {
    res.render('index', { siteData: site });
  });

module.exports = router;
