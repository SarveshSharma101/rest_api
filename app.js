const express = require('express')
const mongoose = require('mongoose')
const router = require('./userRoute')

var mongoDb = "mongodb://127.0.0.1:27017/UserDb"

const app = express()

app.use(express.json())
app.use('/user/v1/', router)

mongoose.connect(mongoDb, ()=>{
    console.log("Connected to mongo db")
})

app.listen(5000, ()=>{
    console.log("Server is listening to 5000...")
})