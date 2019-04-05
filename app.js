var express       = require('express');
var app           = express();
var passport      = require('passport');
var mongoose      = require('mongoose');
var flash         = require('connect-flash');
var appInsights   = require('applicationinsights');

var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var MongoStore    = require('connect-mongo')(session);

var site          = require('./data/site');
var configDb      = require('./config/database.js');
require('./config/passport')(passport);

// Configuration.
appInsights.setup("<appInsights-key>").start();
mongoose.connect(configDb.url, { useMongoClient: true });

// View engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Un-comment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(session({ 
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: '<session secret>', 
    resave: true,
    cookie: { maxAge: (24 * 3600 * 1000 * 14) }, // 14 days.
    saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(passport.authenticate('remember-me'));

// Routes.
var routes  = require('./routes/index');
var login   = require('./routes/login');
var signup  = require('./routes/signup');

app.use('/', routes);
app.use('/login', login);
app.use('/signup', signup);

app.get('/logout', function(req, res) {
  res.clearCookie('remember_me');  
  req.logout();
  res.redirect('/');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      siteData: site,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    siteData: site,
    message: err.message,
    error: {}
  });
});


module.exports = app;
