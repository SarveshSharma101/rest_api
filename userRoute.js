const express = require('express')
const userModel = require('./models/userModel')
const {validateFeilds, checkUserNameAvailability} = require('./userMiddleware/signUpCheck.js')
const {validateLoginFeilds, checkUserAndPassword} = require('./userMiddleware/loginCheck.js')
const {validateLogoutFeilds} = require('./userMiddleware/logoutCheck.js')

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
  await userModel.updateOne({"userName":userName}, {$set:{userLoginStatus:false}})
  return res.json({success:true, message: "Logout successful."})
})

module.exports = router