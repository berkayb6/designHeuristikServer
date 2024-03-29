var mongoose = require('mongoose');
var Schema= mongoose.Schema;
var passportLocalMongoose= require('passport-local-mongoose');

var User= new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
        //required: true
    },
    subscription: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    library: {
        type: Array,
        default: []
    },
    yourHeuristics: {
        type: Array,
        default: []
    },
    projects: {
        type: Array,
        default: []
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);