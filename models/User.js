const mongoose = require('mongoose');
const validator = require('validator')

// Schema of User Table
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    validate(value){
      if(!validator.isAlphanumeric(value)){
        throw new Error('First Name should not be Alphanumeric')
      }
    }
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    validate(value){
      if(!validator.isAlphanumeric(value)){
        throw new Error('Last Name should not be Alphanumeric')
      }
    }
  },
  gender: {
    type: String,
    required: true,
    enum: {values: ['Male', 'Female'], message: 'Gender must be Male or Female.'}
  },
  age: {
    type: String,
    required: true,
    trim: true,
    validate(value){
      if(!validator.isInt(value)){
        throw new Error('Age should not be fractional')
      }
      if(value < 0){
        throw new Error('Age should not be negetive')
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
        if(!validator.isEmail(value)){
          throw new Error('Email is invalid')
        }
      }
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    validate(value){
        if(value.toLowerCase().includes('password')){
          throw new Error('Password can not contain "password"')
        }
      }
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    validate(value){
      if(!validator.isNumeric(value)){
        throw new Error('Please enter valid number')
      } else if(value.length !== 11){
        throw new Error('Phone number must be 11 digit.')
      }
   }
  },
  height: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isFloat(value)){
        throw new Error('Height should not be Alphanumeric')
      }
      if(value < 0){
        throw new Error('Height should not be negetive')
      }
    }
  },
  weight: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isNumeric(value)){
        throw new Error('Weight should not be Alphanumeric')
      }
      if(value < 0){
        throw new Error('Weight should not be negetive')
      }
    }
  },
  userType: {
    type: String
  },
  verify: {
    type: Boolean,
    default: false 
  },
  confirmationToken: {
    type: String
  },
  confirmationExpires: {
    type: Date
  },
  cookieToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  profilePicture:{
    type: Buffer
  },
  patientList: [{
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    patientName: {
      type: String
    },
    patientEmail: {
      type: String
    }
  }],
  guardianList: [{
    guardianId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    guardianName: {
      type: String
    },
    guardianEmail: {
      type: String
    }
  }]
})

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.confirmationToken
  delete userObject.confirmationExpires
  delete userObject.resetPasswordExpires
  delete userObject.resetPasswordToken
  delete userObject.cookieToken
  delete userObject.profilePicture
  delete userObject.date
  delete userObject.verify
  delete userObject.password
  delete userObject.__v
  return userObject
}

const User = mongoose.model('User', UserSchema);
module.exports = User