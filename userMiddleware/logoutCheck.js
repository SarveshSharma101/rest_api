const userModel = require('../models/userModel')

const validateLogoutFeilds = (req, res, next)=>{
  const {userName} = req.params
  if(!userName){
    return res.status(412)
            .json({success:false, message:"Mandatory fields missing. Please pass userName"})
  }else if(typeof userName != "string"){
    return res.status(412)
    .json({success:false, message:"Invalid datatype of the parameters. Expected type string"})
  }
  next()
}

module.exports = {validateLogoutFeilds}