var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// Define the schema for our user model
var userSchema = new Schema({
    userName : String,
    local : {
        email       : String,
        password    : String,
    }
});

// Generate a hash of the supplied password.
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if the supplied password is valid.
userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create the model for users and expose it to our app.
module.exports = mongoose.model('User', userSchema);