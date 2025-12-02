const mongoose = require("mongoose");
const Joi = require("joi");

const userSignUpDataSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  picture: {
    type: String,
    required: false,
  },
  loginMethod: {
    type: String,
    enum: ["email", "google"],
    default: "email",
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
  verifyUserPer: {
    type: Number,
    default: 90,
  },
  userBirthDay: {
    type: Date,
    default: new Date(),
  },
});

const verificationOTPSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
});

const userSignUpValidation = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[0-9]/, "digit")
    .pattern(/[!@#$%^&*]/, "special")
    .required()
    .messages({
      "string.pattern.uppercase":
        "Password must contain at least 1 uppercase letter",
      "string.pattern.digit": "Password must contain at least 1 number",
      "string.pattern.special":
        "Password must contain at least 1 special character (!@#$%^&*)",
      "string.min": "Password must be at least 8 characters long",
    }),
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
});

const userSigninValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[0-9]/, "digit")
    .pattern(/[!@#$%^&*]/, "special")
    .required()
    .messages({
      "string.pattern.uppercase":
        "Password must contain at least 1 uppercase letter",
      "string.pattern.digit": "Password must contain at least 1 number",
      "string.pattern.special":
        "Password must contain at least 1 special character (!@#$%^&*)",
      "string.min": "Password must be at least 8 characters long",
    }),
});

const userSignUpModel = mongoose.model("userSignUpModel", userSignUpDataSchema);
const verificationOTPModel = mongoose.model(
  "verificationOTPModel",
  verificationOTPSchema
);

module.exports = {
  userSignUpModel,
  userSignUpValidation,
  userSigninValidation,
  verificationOTPModel,
};
