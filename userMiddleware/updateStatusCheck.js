const userModel = require('../models/userModel')

const validateUpdateStatusFeilds = (req, res, next)=>{
  const {status} = req.body
  if(!status){
    return res.status(412)
            .json({success:false, message: "Mandatory field status is missing. Please pass status"})
  }else if(typeof status != "string"){
    return res.status(412)
            .json({success:false, message: "Invalid datatype of status. Should be string"})
  }else if(status.length == 0){
    return res.status(412)
            .json({success:false, message: "status should not be empty"})
  }
  next()
}

const checkUserLoggedInOrNot = async (userName)=>{
  var statusFlag = false
  const user = await userModel.find({"userName":userName})
  console.log(user)
  return user
}

module.exports = {validateUpdateStatusFeilds, checkUserLoggedInOrNot}