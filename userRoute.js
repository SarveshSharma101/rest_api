const express = require('express')
const userModel = require('./models/userModel')
const {validateFeilds, checkUserNameAvailability} = require('./userMiddleware/signUpCheck.js')

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





module.exports = router