const express = require('express')
const userModel = require('./models/userModel')
const {validateFeilds, checkUserNameAvailability} = require('./userMiddleware/signUpCheck.js')
const {validateLoginFeilds, checkUserAndPassword} = require('./userMiddleware/loginCheck.js')
const {validateLogoutFeilds} = require('./userMiddleware/logoutCheck.js')
const {validateUpdateStatusFeilds, checkUserLoggedInOrNot} = require('./userMiddleware/updateStatusCheck.js')

const router = express.Router()

//@@@@@@@@@@@@@@@@@@@@@ SIGN-UP API @@@@@@@@@@@@@@@@@@@@@@@@@@@
router.use('/signUp', [validateFeilds])
router.post('/signUp', async (req, res)=>{
  const user = {
      "userEmail": req.body.email,
      "userName": req.body.userName,
      "password": req.body.password
  }
  if(req.body.userStatus){
      user.userStatus = req.body.userStatus
  }
  var checkUsername = await checkUserNameAvailability(req.body.userName)
  if(!checkUsername.success){ 
    return res.status(400).json(checkUsername)
  }else{
    new userModel(user)
      .save().then(data =>{
        return res.json({
            success:true,
            message:"Registration successfull!!!. Please use login."
        })
      }).catch(err=>{
        console.log(err)
        return res.status(400)
                .json({
                    success: false, 
                    message:"There was some error while registration. Please try again later"
                })
      })
  }

})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ LOGIN API @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
router.use('/login', validateLoginFeilds)
router.put('/login', async (req, res)=>{
  const {userName, password} = req.body
  const _checkUserAndPassword = await checkUserAndPassword(userName, password)

  if(_checkUserAndPassword.success){
    await userModel.updateOne({"userName":userName}, {$set:{userLoginStatus:true}})
    return res.json({success:true, message: "Login successful."})
  }else{
    return res.status(400).json(_checkUserAndPassword)
  }
})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ LOGOUT API @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
router.use('/logout/:userName', validateLogoutFeilds)
router.put('/logout/:userName', async (req, res)=>{
  const {userName} = req.params
  const output = await userModel.updateOne({"userName":userName}, {$set:{userLoginStatus:false}})
  if(output.n == 0){
    return res.status(400).json({success:false, message: "Logout failed. No such user"})
  }else if(output.nModified == 0) return res.status(400).json({success:false, message: "Logout failed. User already logged out"})
  return res.json({success:true, message: "Logout successful."})
})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UPDATE STATUS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
router.use('/upadteStatus/:userName', validateUpdateStatusFeilds)
router.put('/upadteStatus/:userName', async (req, res)=>{
  const {status} = req.body
  const {userName} = req.params
  const user = await checkUserLoggedInOrNot(userName)
  if(user.length==0){
    return res.status(400).json({success:false, message: "Update status failed. No such user found"})
  }
  else if(user[0].userLoginStatus){
    const output = await userModel.updateOne({"userName":userName}, {$set:{userStatus:status}})
    if(output.n == 0){
      return res.status(400).json({success:false, message: "Update status failed. No such user found"})
    }
    return res.json({success:true, message: "Update successful."})
  }else{
    return res.status(400).json({success:false, message: "User is logged out please login."})
  }
})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ DELETE USER @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

router.delete('/deleteUser/:userName', async (req, res)=>{
  const {userName} = req.params
  try{
    const output = await userModel.remove({"userName":userName})
    console.log(output)
    if(output.n == 0){
      return res.status(400).json({success:false, message: "Deletion was unsuccessful. No such user to delete"})
    }
    res.status(200).json({success:true, message:`Deleted user with username = ${userName}`})
  }catch(err){
      console.log(err)
  }
})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ GET ALL USERS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

router.get('/getUsers', async (req, res)=>{
  const users = await userModel.find()

  if(users.length==0){
    res.status(200).json({success: true, message: "There are no user in DB"})
  }else{
    res.status(200).json({success: true, users:users})
  }
})

module.exports = router