const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const async = require("async");
const User = require("../models/User");
const { sendRequestEmail } = require("../emails/account");
const { use } = require("passport");

// Create Patient Manually
router.post("/users/patientRegister", async (req, res) => {
  const {firstname, lastname, gender, age,email, phone, height, weight, guardianId} = req.body;
  let newUser;

  const guardian = await User.findOne({
    _id: guardianId
  })

  if(guardian.guardianList.length > 0){
    return res.status(404).json({
      message: 'You already have a guradian.'
    })
  }

  if(guardian.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already a patient of a user.'
    })
  }

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({
        message: "Email already exists"
      });
    } else {
      
      newUser = new User({
        firstname,
        lastname,
        gender,
        age,
        email,
        phone,
        height,
        weight,
        guardianList: {
          guardianId,
          guardianName: guardian.firstname+' '+guardian.lastname,
          guardianEmail: guardian.email
        }
      });

      const Token = jwt.sign(
        { firstname, lastname, email },
        process.env.JWT_SECRET
      );
      newUser.userType = "Patient";
      newUser.confirmationToken = Token;
      newUser.confirmationExpires = Date.now() + 3600000;

      try {
        newUser.save();
        sendRequestEmail(req.body.email, Token);

        return res.status(201).json({
          newUser,
          message: "An verification-mail has been sent to " +newUser.email +". Please verify!",
        });
      } catch (error) {
        return res.status(400).json({
          message: error
        });
      }
    }
  });
});

// Patient Id verification
router.post("/conformation/request/:token", (req, res) => {
  const { password, confirm } = req.body;
  async.waterfall(
    [
      function (done) {
        User.findOne({
            confirmationToken: req.params.token,
            confirmationExpires: { $gt: Date.now() }
          },
          (err, user) => {
            if (!user) {
              return res.status(400).json({
                message: "Password set token for your account is invalid or has expired."
              });
            }
            user.verify = true;
            if (password === confirm) {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                  if (err) throw err;
                  if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/) === null){
                    return res.status(400).json({
                      message: 'Password must have at least one uppercase, one lower case and one special character'
                    })
                  }
                  user.password = hash;
                  const guardian = await User.findOne({
                    _id: user.guardianList[0].guardianId
                  })
                  try {
                    if((!guardian.guardianList.length > 0 && !guardian.patientList.length > 0) && (!guardian.guardianList.length > 0) && (!guardian.patientList.length > 0)){
                      guardian.patientList = [{
                        patientId: user._id,
                        patientName: user.firstname+' '+user.lastname,
                        patientEmail: user.email
                      }]
                      guardian.userType = 'Guardian'
                      await guardian.save();
                    } else {
                      user.guardianList = []
                      user.userType = ''
                    }
                    await user.save();
                    return res.status(200).json({
                      message: "Password added successfully to your account. You can now login into your account"
                    });
                  } catch (e) {
                    return res.status(400).json({
                      message: e
                    });
                  }
                });
              });
            } else {
              return res.status(400).json({
                message: "Passwords do not match."
              });
            }
          }
        );
      },
    ],
    function (err) {}
  );
});

// Patient Account creation token verification
router.get('/conformation/request/:token', function(req, res) {
  User.findOne({ 
    confirmationToken: req.params.token, 
    confirmationExpires: { $gt: Date.now() } 
  }, (err, user) => {
    if (!user) {
      return res.status(400).json({
        message: 'This link has been expired'
      })
    }
    return res.status(200).json({
      message: 'You can set password with this link!'
    })  
  });
})

module.exports = router;