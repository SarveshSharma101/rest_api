const mongoose = require('mongoose')

var schema = mongoose.Schema

var userModel = new schema({
    "UserEmail":{
        type: String,
        required: true
    },
    "UserName":{
        type: String,
        required: true
    },
    "UserPassword":{
        type: String,
        min: [8, "Password is too short. Min 8 character required!!!"],
        required: true
    },
    "UserLoginStatus":{
        type: Boolean,
        default: false
    },
    "UserStatus":{
        type: String,
        default: `Hello world, I am a user!!!.`
    }
})

module.exports = mongoose.model("user", userModel)