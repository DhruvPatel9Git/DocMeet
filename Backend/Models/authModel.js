const mongoose = require('mongoose')
const Joi = require('joi')

const userSignUpDataSchema = mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : false,
    },
    picture: {
        type: String,
        required: false
    },
    loginMethod: {
        type: String,
        enum: ['email', 'google'],
        default: 'email'
    },
    otp: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
    verifyUserPer : {
        type :  Number,
        default : 90
    },
    userBirthDay : {
        type : Date,
        default : new Date()
    }
})

const verificationOTPSchema = mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : false,
    },
    otp: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
})

const userSignUpValidation = Joi.object({
    fullname : Joi.string().min(3).max(30).required(),
    email : Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-z0-9]{3,30}$")).required(),
    // birthday: Joi.date()
    // .less('now')
    // .required()
    // .custom((value, helpers) => {
    //     const today = new Date()
    //     const age = today.getFullYear() - value.getFullYear()
    //     const m = today.getMonth() - value.getMonth()
    //     if (age < 18 || (age === 18 && m < 0)) {
    //         return helpers.message("You must be at least 18 years old")
    //     }
    //     return value
    // })
})

const userSigninValidation = Joi.object({
    email : Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-z0-9]{3,30}$")).required(),
})

const userSignUpModel = mongoose.model('userSignUpModel',userSignUpDataSchema)
const verificationOTPModel = mongoose.model('verificationOTPModel',verificationOTPSchema)

module.exports = {userSignUpModel,userSignUpValidation,userSigninValidation,verificationOTPModel}