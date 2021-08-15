const userModel = require('../models/userModel')

const validateLoginFeilds = (req, res, next)=>{
  const {userName, password} = req.body
  if(!userName || ! password){
    return res.status(412)
            .json({success:false, message:"Mandatory fields missing. Please pass userName/password"})
  }else if(typeof userName != "string" || typeof password != "string"){
    return res.status(412)
    .json({success:false, message:"Invalid datatype of the fields. Expected type string"})
  }
  next()
}

const checkUserAndPassword = async (userName, password)=>{
  const users = await userModel.find((err, docs)=>{
    if(err){
      return {success:false, message:"There was some error while access the DB"}
    }
  })
  var flag = false
  var pflag = false
  users.forEach(user => {
    if(user.userName == userName) flag = true
    if(user.password == password) pflag = true
  })
  if(!flag) return {success:false, message:"Invalid email-Id. Please check again."}
  else if(!pflag) {
    return {success:false, message:"Password is incorrect"} 
  }

  return {success:true, message:"User email-Id and password is valid"} 
}

module.exports = {validateLoginFeilds, checkUserAndPassword}