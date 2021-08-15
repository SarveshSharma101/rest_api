const express = require('express')
const mongoose = require('mongoose')
const userModel = require('./models/userModel')

var mongoDb = "mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb"

const app = express()


mongoose.connect(mongoDb, ()=>{
    console.log("Connected to mongo db")
})
app.listen(5000, ()=>{
    console.log("Server is listening to 5000...")
})