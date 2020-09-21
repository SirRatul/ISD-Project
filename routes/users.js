const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const moment = require('moment')
const passport = require('passport');
// const sharp = require('sharp')
const jwt = require('jsonwebtoken')
const async = require('async');
const User = require('../models/User');
const Routine = require('../models/Routine');
const Guardianship = require("../models/Guardianship");
const {sendWelcomeEmail, sendRoutineMissedEmail , sendResetEmail} =require('../emails/account')
const axios = require('axios');
const multer = require('multer')
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req , file , cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('Please upload a picture.'))
    }
    cb(undefined , true)
  }
})

/* router.get('/getUser/:id' , async (req , res ) =>{
    try{
      const user = await User.findById(req.params.id)
      if(!user){
          return res.status(404).json({
            message: 'User not found'
          })
      }
      res.status(200).json({
        user
      })
    }catch(e){
        res.status(404).json({
          message: e
        })
    }
}) */

// Registration 
router.post('/register', (req, res) => {
  const {firstname, lastname, gender, age, email, password, password2, phone, height, weight, userType} = req.body
  let newUser
  
  if (password != password2) {
    return res.status(400).json({
      message: 'Passwords do not match'
    }) 
  }
  
  if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/) === null){
    return res.status(400).json({
      message: 'Password must have at least one uppercase, one lower case and one special character'
    })
  }

  User.findOne({ email: email }).then(user => {
    if (user) {
      return res.status(400).json({
        message: 'Email already exists'
      })
    } else {
      newUser = new User({firstname, lastname, gender, age, email, password, phone, height, weight, userType})

      const Token = jwt.sign({ firstname , lastname , email } , process.env.JWT_SECRET)
      newUser.confirmationToken = Token
      newUser.confirmationExpires = Date.now() + 3600000

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) {
            throw err
          } 
          newUser.password = hash;
            try{
                await newUser.save()
                sendWelcomeEmail(req.body.email , Token)

                return res.status(201).json({
                  newUser,
                  message: 'An verification-mail has been sent to ' + newUser.email + ' . Please verify !'
                })
            }catch(error){
                return res.status(400).json({
                  message: error
                })
            }
          })
        })
      }
  })
})

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local' ,(err, user, info) => {
    const {email, password} = req.body
    if (err) { 
      return res.status(400).json({
        message: err
      })
    }
    if(!user){
      return res.status(400).json({
        message: 'Invalid credentials, could not log you in'
      })
    }
    if(user.verify !== true){
      return res.status(400).json({
        message: 'Please verify your email to login.'
      })
    }
    let isValidPassword = false
    if(user.verify === true){
      isValidPassword =  bcrypt.compare(password, user.password).then(() => {
        isValidPassword = true
      }).catch((error) => {
        return res.status(400).json({
          message: 'Could not log you in, please check your credentials and try again.'
        })
      })
    }
    if(isValidPassword){
      req.logIn(user, function(err) {
        if (err) { 
          return res.status(400).json({
            message: err

          }) 
        }
        const Token = jwt.sign({ firstname: user.firstname , lastname:user.lastname , email:user.email } , process.env.JWT_SECRET)
        user.cookieToken = Token
        user.save()
        return res.status(200).json({
          user,
          Token,
          message: 'Logged in'
        })
      })
    } else{
      return res.status(400).json({
        message: 'Invalid credentials, could not log you in.'
      })
    }
  })(req, res, next)
})

// User List Excluding Myself
router.get('/userListExcludingMyself/:id' , async (req , res) => {
    let owner = req.params.id
    /* if(req.user){
        owner = req.user._id
    } else {
        owner = req.params.id
    } */
    if(owner === undefined){
      return res.status(404).json({
        message: 'You must logged in'
      })
    }
    const users = await User.find({})
    if(!users){
      return res.status(404).json({
        message: 'No users'
      })
    }
    const userMap = users.filter(function(item) {
      return JSON.stringify(item._id) !== JSON.stringify(owner)
    })
    return res.status(200).json({
      user: userMap
    })
})

// Logout
router.post('/logout', (req, res) => {
  const {id} = req.body
  let userId = id || req.user._id
  if(req.user){
    userId = req.user._id
  } else {
    userId = id
  }
  User.findOne({_id: userId}).then((user) =>{
    user.cookieToken = undefined
    user.save().then(() => {}).catch((error) => {
      return res.status(400).json({
        message: error
      })
    })
  }).catch((error) => {
    return res.status(400).json({
      message: error
    })
  })
  req.logout();
  return res.status(200).json({
    message: 'You are logged out.'
  })
});

// Verify Cookie
router.post('/verifyCookie', (req, res) => {
  const {token} = req.body
  User.findOne({cookieToken: token}).then((user) =>{
    if(!user){
      return res.status(400).json({
        message: 'Cookie not Exist'
      })
    }
    return res.status(200).json({
      message: 'Cookie Exist'
    })
  }).catch((error) => {
    return res.status(400).json({
      message: error
    })
  })
});

// Forgot Password
router.post('/forgot', function(req, res, next) {
  const {email} = req.body
  async.waterfall([
    function(done) {
      User.findOne({ email }, function(err, user) {
        if (!user) {
          return res.status(400).json({
            message: 'No account with that email address exists..'
          })
        }
        const token = jwt.sign({_id: user._id } , process.env.JWT_SECRET)

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      sendResetEmail(email , token)
      return res.status(200).json({
        token,
        message: 'An e-mail has been sent to ' + email + ' with further instructions.'
      })
    }
  ], function(err) {
    if (err) return next(err);
  });
});

// New Password Set
router.post('/reset/:token', function(req, res) {
  const {password, confirm} = req.body
  async.waterfall([
    function(done) {
      User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { 
          $gt: Date.now() 
        } 
      }, (err, user) => {
        if (!user) {
          return res.status(400).json({
            message: 'Password reset token is invalid or has expired.'
          })
        }
        if(password === confirm) {
          if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/) === null){
            return res.status(400).json({
              message: 'Password must have at least one uppercase, one lower case and one special character'
            })
          }
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
              if (err) throw err;
              user.password = hash;
              try{
                  await user.save()
                  return res.status(200).json({
                    message: 'Password updated successfully.'
                  })
              }catch(e){
                return res.status(400).json({
                  message: e
                })
              }
            });
          });
        } else {
          return res.status(400).json({
            message: 'Passwords do not match.'
          })
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'codebreakers8094@gmail.com',
          pass: pass
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'codebreakers8094@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err);
      });
    }
  ], function(err) {
  });
});

// Forgot Password Token Verify
router.get('/reset/:token', function(req, res) {
  User.findOne({ 
    resetPasswordToken: req.params.token, 
    resetPasswordExpires: { $gt: Date.now() } 
  }, (err, user) => {
    if (!user) {
      return res.status(400).json({
        message: 'This link has been expired'
      })
    }
    return res.status(200).json({
      message: 'You can update password with this link!'
    })  
  });
})

// Remove User Automatically If User is not verified within 1 hour
User.find({verify: false }).then((user) =>{
  user.forEach((element) => {
    var expire = moment(new Date()).isSameOrBefore(element.confirmationExpires)
    if(!expire){
      User.deleteOne(element).then((user) =>{}).catch((e) =>{
        console.log(e)
      })
    }
  })
})

// Send Email to Guardian automatically if patient missed 3 routines in a day
User.find({}).then((user) =>{
  user.forEach((element) => {
    var today = new Date();
    today = today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0');
    today = moment(today, "YYYY/MM/DD");
    var compareDateTime = moment(`${moment(today).format()} 23:59`, 'YYYY-MM-DD HH:mm').format()
    // console.log(element._id)
    // console.log((moment(moment(compareDateTime).format('YYYY-MM-DD HH:mm'))).isSame(moment(moment(new Date()).format('YYYY-MM-DD HH:mm'))))
    if(element.guardianList.length > 0 && element.patientList.length > 0){
      // console.log('If Start')
      // console.log(element._id)
      axios.get(process.env.BACKEND_URL+'routineNotification/'+element._id).then(function (response) {
        // console.log(element._id)
        if(response.data.routine){
          // console.log('Length:'+response.data.routine.length)
          if(response.data.routine.length > 3){
            if((moment(moment(compareDateTime).format('YYYY-MM-DD HH:mm'))).isSame(moment(moment(new Date()).format('YYYY-MM-DD HH:mm')))){
              // console.log('Email Sent '+element.guardianList[0].guardianEmail)
              sendRoutineMissedEmail(element.guardianList[0].guardianEmail , response.data.routine, element.guardianList[0].guardianName, element.patientList[0].patientName)
            }
          }
        }
        // console.log(response.data);
      })
      .catch(function (error) {
        // console.log(error);
      })
      // console.log('If End')
    } else if(element.guardianList.length > 0){
      // console.log('If 2 Start')
      // console.log(element._id)
      axios.get(process.env.BACKEND_URL+'routineNotification/'+element._id).then(function (response) {
        // console.log(element._id)
        if(response.data.routine){
          // console.log('Length:'+response.data.routine.length)
          if(response.data.routine.length > 3){
            if((moment(moment(compareDateTime).format('YYYY-MM-DD HH:mm'))).isSame(moment(moment(new Date()).format('YYYY-MM-DD HH:mm')))){
              // console.log('Email Sent '+element.guardianList[0].guardianEmail)
              sendRoutineMissedEmail(element.guardianList[0].guardianEmail , response.data.routine, element.guardianList[0].guardianName, response.data.routine[0].notificationArray.owner[0].patient[0].patientName)
            }
          }
        }
        // console.log(response.data);
      }) 
      .catch(function (error) {
        // console.log(error);
      })
      // console.log('If 2 End')
    }
  })
})

//Registration Verify
router.get('/conformation/:token', (req, res) => {
  User.findOne({ 
    confirmationToken: req.params.token, 
    confirmationExpires: { $gt: Date.now() } 
  }, (err, user) => {
    if (!user) {
      return res.status(400).json({
        message: 'This link has been expired , Please register again !'
      })
    }
    user.verify=true
    user.save()
    return res.status(200).json({
      message: 'You are verified , Now you can login!'
    })  
  });
})

// Get Full Profile details of a user
router.get('/users/:id', async (req, res) => {
  let userId = req.params.id
  try {
    const user = await  User.findOne({_id: userId}).exec()
    if(!user){
      return res.status(400).json({
        message: "User not found"
      })
    }
    if(user.profilePicture){
      const buffer = Buffer.from(user.profilePicture, 'binary').toString('base64');
      const base64data = Buffer.from(buffer, 'base64');
      return res.status(200).json({
        profilePicture: base64data.toString(),
        user
      })
    }
    return res.status(200).json({
      user
    })
  } catch (error) {
    console.log(error)
  }
})

// Profile Picture Update
router.patch('/users/profilePicture/:id' , upload.single('updatepp') , async(req,res) => {
  const buffer = Buffer.from(req.file.buffer, 'binary').toString('base64');

  let userId = req.params.id
  
  const user = await User.findOne({_id: userId}).exec()
  if(!user){
    return res.status(400).json({
      message: "User not found"
    })
  }
  user.profilePicture = buffer
  await user.save() 
  res.status(200).json({ 
    message: 'Profile Picture Successfully uploaded'
  })
} , (error , req , res , next ) => {
  res.status(400).json({ 
    message: error.message
  })
})

// Profile Picture Delete
router.delete('/users/profilePicture/:id' ,  async(req,res) => {
  let userId = req.params.id
  
  const user = await User.findOne({_id: userId}).exec()
  if(!user){
    return res.status(400).json({
      message: "User not found"
    })
  }
  user.profilePicture = undefined
  await user.save()
  res.send({ message: 'Your profile picure has been successfully deleted'})
})

// Profile Update
router.patch('/users/me/:id',  async ( req , res) => {
  let userId = req.params.id
  
  const updates = Object.keys(req.body)
  const allowedupdates = ['firstname', 'lastname' , 'age' , 'weight' , 'height' , 'phone']
  const isValidOperation = updates.every((update) => allowedupdates.includes(update))
  const {password, newPassword, confirmPassword} = req.body

  if(!password && !newPassword && !confirmPassword)
  {
    User.findOne({_id: userId}).then((user) =>{
      updates.forEach((update) => user[update] = req.body[update])
      let routine
      if(user.guardianList.length > 0 && user.patientList.length > 0){
          routine = Routine.find({"owner.guardian.guardianId": userId, "owner.patient.patientId": userId}).then((routine) => {
            routine.forEach((item) => {
              item.owner[0].guardian[0].guardianName = req.body.firstname+' '+req.body.lastname
              item.owner[0].patient[0].patientName = req.body.firstname+' '+req.body.lastname
              item.save()
            })
          })
          Guardianship.find({requester: userId}).then((requester) => {
            requester.forEach((item) => {
              item.requesterName = req.body.firstname+' '+req.body.lastname
              item.save()
            })
          });
          user.guardianList[0].guardianName = req.body.firstname+' '+req.body.lastname
          user.patientList[0].patientName = req.body.firstname+' '+req.body.lastname
      } else if(user.guardianList.length === 0 && user.patientList.length === 0){
        Guardianship.find({requester: userId}).then((requester) => {
          requester.forEach((item) => {
            item.requesterName = req.body.firstname+' '+req.body.lastname
            item.save()
          })
        });
      } else if(user.guardianList.length > 0){
        User.findOne({_id: user.guardianList[0].guardianId}).then((guardian) =>{
          guardian.patientList[0].patientName = req.body.firstname+' '+req.body.lastname
          guardian.save()
        })
        Guardianship.find({requester: userId}).then((requester) => {
          requester.forEach((item) => {
            item.requesterName = req.body.firstname+' '+req.body.lastname
            item.save()
          })
        });
        routine = Routine.find({"owner.patient.patientId": userId}).then((routine) => {
          routine.forEach((item) => {
            item.owner[0].patient[0].patientName = req.body.firstname+' '+req.body.lastname
            item.save()
          })
        })
      } else if(user.patientList.length > 0){
        User.findOne({_id: user.patientList[0].patientId}).then((patient) =>{
          patient.guardianList[0].guardianName = req.body.firstname+' '+req.body.lastname
          patient.save()
        })
        Guardianship.find({requester: userId}).then((requester) => {
          requester.forEach((item) => {
            item.requesterName = req.body.firstname+' '+req.body.lastname
            item.save()
          })
        });
        routine = Routine.find({"owner.guardian.guardianId": userId}).then((routine) => {
          routine.forEach((item) => {
            item.owner[0].guardian[0].guardianName = req.body.firstname+' '+req.body.lastname
            item.save()
          })
        })
      }
      user.save().then(() => {
        return res.status(200).json({
          message: 'Successfully updated'
        })
      }).catch((error) => {
        return res.status(400).json({
          message: error
        })
      })
    }).catch((error) => {
      return res.status(400).json({
        message: error
      })
    })
  }
  else if(password && (!newPassword || !confirmPassword)){
    return res.status(400).json({
      message: 'Please enter your new password for update password!'
    }) 
  } else {
    User.findOne({_id: userId}).then((user) =>{
      bcrypt.compare(password, user.password, (err, data) => {
        if (err){
          throw err
        } 
        if (data) {
          if(newPassword === confirmPassword) {
            if(newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/) === null){
              return res.status(400).json({
                message: 'Password must have at least one uppercase, one lower case and one special character'
              })
            }
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newPassword, salt, async (err, hash) => {
                if (err){
                  throw err;
                } 
                // user.password = hash;
                try{
                    updates.forEach((update) => user[update] = req.body[update])
                    user.password = hash;
                    let routine
                    if(user.guardianList.length > 0 && user.patientList.length > 0){
                        routine = Routine.find({"owner.guardian.guardianId": userId, "owner.patient.patientId": userId}).then((routine) => {
                          routine.forEach((item) => {
                            item.owner[0].guardian[0].guardianName = req.body.firstname+' '+req.body.lastname
                            item.owner[0].patient[0].patientName = req.body.firstname+' '+req.body.lastname
                            item.save()
                          })
                        })
                        Guardianship.find({requester: userId}).then((requester) => {
                          requester.forEach((item) => {
                            item.requesterName = req.body.firstname+' '+req.body.lastname
                            item.save()
                          })
                        });
                        user.guardianList[0].guardianName = req.body.firstname+' '+req.body.lastname
                        user.patientList[0].patientName = req.body.firstname+' '+req.body.lastname
                    } else if(user.guardianList.length === 0 && user.patientList.length === 0){
                      Guardianship.find({requester: userId}).then((requester) => {
                        requester.forEach((item) => {
                          item.requesterName = req.body.firstname+' '+req.body.lastname
                          item.save()
                        })
                      });
                    } else if(user.guardianList.length > 0){
                      User.findOne({_id: user.guardianList[0].guardianId}).then((guardian) =>{
                        guardian.patientList[0].patientName = req.body.firstname+' '+req.body.lastname
                        guardian.save()
                      })
                      Guardianship.find({requester: userId}).then((requester) => {
                        requester.forEach((item) => {
                          item.requesterName = req.body.firstname+' '+req.body.lastname
                          item.save()
                        })
                      });
                      routine = Routine.find({"owner.patient.patientId": userId}).then((routine) => {
                        routine.forEach((item) => {
                          item.owner[0].patient[0].patientName = req.body.firstname+' '+req.body.lastname
                          item.save()
                        })
                      })
                    } else if(user.patientList.length > 0){
                      User.findOne({_id: user.patientList[0].patientId}).then((patient) =>{
                        patient.guardianList[0].guardianName = req.body.firstname+' '+req.body.lastname
                        patient.save()
                      })
                      Guardianship.find({requester: userId}).then((requester) => {
                        requester.forEach((item) => {
                          item.requesterName = req.body.firstname+' '+req.body.lastname
                          item.save()
                        })
                      });
                      routine = Routine.find({"owner.guardian.guardianId": userId}).then((routine) => {
                        routine.forEach((item) => {
                          item.owner[0].guardian[0].guardianName = req.body.firstname+' '+req.body.lastname
                          item.save()
                        })
                      })
                    }
                    await user.save()
                    return res.status(200).json({
                      message: 'Profile updated successfully.'
                    })
                }catch(e){
                  return res.status(400).json({
                    message: 'Profile can not update successfully.'
                  })
                }
              })
            })
          } else {
            return res.status(400).json({
              message: 'Passwords do not match.'
            })
          }
        } else {
          return res.status(400).json({
            message: 'Current Password is not correct.'
          })
        }
      })
    }).catch((error) => {
      return res.status(400).json({
        message: "error 3"+error
      })
    })
  }
})

module.exports = router;