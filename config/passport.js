var LocalStrategy       = require('passport-local').Strategy;
var RememberMeStrategy  = require('passport-remember-me-extended').Strategy;

var User                = require('../data/user');
var Token               = require('../data/token');

var configAuth          = require('./authentication');

module.exports = function(passport) {
    // Passport session setup; required for persistent login sessions.
    // Passport needs the ability to serialize and deserialize users out of the session.

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // Local Signup
    // We are using named strategies since we have ones for login, signup and connect.
    // By default, if there was no name, it would just be called 'local'.
    passport.use('local-signup', new LocalStrategy({
            passReqToCallback : true // Allows us to pass back the entire request to the callback.
        },
        function(req, username, password, done) {
            // Asynchronous; User.findOne wont fire unless data is sent back.
            process.nextTick(function() {
                // Find a user whose username is the same as the form's username.
                // We are checking to see if the user trying to login already exists.
                User.findOne({ 'userName' : username }, function(err, existingUser) {
                    // If there are any errors, return the error.
                    if (err)
                        return done(err);
        
                    // Check to see if there's already a user with that username.
                    if (existingUser)
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    
                    if (req.user) {
                        // Already logged in, so link to that account.
                        var user = req.user;
                        user.userName       = username;
                        user.local.email    = req.body.email;
                        user.local.password = user.generateHash(password);
                        
                        // Save the user.
                        user.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        })
                    } else {
                        // Not logged in, so create the user.
                        var newUser = new User();
        
                        // Set the user's local credentials.
                        newUser.userName        = username;
                        newUser.local.email     = req.body.email;
                        newUser.local.password  = newUser.generateHash(password);
        
                        // Save the user.
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });    
            });
        }));

    // Local Login
    // We are using named strategies since we have ones for login, signup and connect.
    // By default, if there was no name, it would just be called 'local'.
    passport.use('local-login', new LocalStrategy({
            passReqToCallback : true // Allows us to pass back the entire request to the callback.
        },
        function(req, username, password, done) {
            // Check if the user is already logged in.
            if (!req.user) {
                // Find a user whose username is the same as the form's username.
                // We are checking to see if the user trying to login already exists.
                User.findOne({ 'userName' :  username }, function(err, user) {
                    // If there are any errors, return the error before anything else.
                    if (err)
                        return done(err);
        
                    // If no user is found, return the message.
                    if (!user) {
                        // req.flash is the way to set flashdata using connect-flash.
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
        
                    // If the user is found but the password is wrong
                    if (!user.isValidPassword(password)) {
                        // create the loginMessage and save it to session as flashdata.
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
        
                    // All is well, return successful user.
                    return done(null, user);
                });
            } else {
                // User already exists and is logged in; we have to link accounts.
                var user = req.user;

                // Update the current user's Local details.
                user.local.email    = req.body.email;
                user.local.password = password;

                // Save the user.
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        }));
        
    passport.use(new RememberMeStrategy(
        function(token, done) {
            Token.consume(token, function(err, user) {
                if (err) {
                    return done(err);
                }
                
                if (!user) {
                    return done(null, false);
                }
                
                return done(null, user);
            });
        },
        function(user, done) {
            var token = Token.generateToken(64);
            Token.save(token, user.id, function(err) {
                if (err) {
                    return done(err);
                }
                
                return done(null, token);
            });
        }
    ));    
};