const userModel = require('../models/userModel')

const validateFeilds = (req, res, next)=>{
  const {email, userName, password} = req.body
  if(!email || !userName || !password){
    return res.status(412)
              .json({success: false, message: "Required fields missing in body. Request body should contain 'email', 'userName', 'password'"})
  }else if((typeof email != "string") || (typeof userName != "string") || (typeof password != "string")){
    return res.status(412)
              .json({success: false, message: "Invalid datatype. Datatype of all the required fields should be string"})
  }else if(password.length<8){
    return res.status(412)
              .json({success: false, message: "Password is too short. Min length is 8 character!!!"})
  }
  next()
}

const checkUserNameAvailability = async (userName)=>{
  const users = await userModel.find((err, docs)=>{
      if(err){
        return {success:false, message:"There was some error while access the DB"}
    }
  })
  var flag = true
  users.forEach(user => {  
    if(user.userName == userName) flag = false
  })
  if(!flag) return {success:false, message:"User name is already taken."}
  else return {success:true, message:"User Name is available"}
}

module.exports = {validateFeilds, checkUserNameAvailability}