const mongoose = require('mongoose')

var schema = mongoose.Schema

var userModel = new schema({
    "userEmail":{
        type: String,
        required: true
    },
    "userName":{
        type: String,
        required: true
    },
    "password":{
        type: String,
        min: [8, "Password is too short. Min 8 character required!!!"],
        required: true
    },
    "userLoginStatus":{
        type: Boolean,
        default: false
    },
    "userStatus":{
        type: String,
        default: `Hello world, I am a user!!!.`
    }
})

module.exports = mongoose.model("user", userModel)