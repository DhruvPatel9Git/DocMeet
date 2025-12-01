const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userSignUpModel"
    },
    doctorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Doctor"
    },
    slotTime : {
        type : String,
        required : true
    },
    newDate : {
        type : Date,
        required : true
    },
    slotDate : {
        type : String,
        required : true 
    },
    monthNum : {
        type : Number,
        required : true
    },
    slotDay : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum: ['pending', 'approved', 'cancelled'],
        required : true,
        default : 'pending'
    },
    cancelledByUser : {
        type : Boolean,
        default: false
    },
    completedAppointment : {
        type : Boolean,
        default: false
    },
    medicineList: [
        {
          name: { type: String },
          dosage: { type: String },
          frequency: { type: String },
          duration: { type: String }
        }
      ]
},{ timestamps: true })

appointmentModel = mongoose.model('appointmentModel',appointmentSchema)
module.exports = {appointmentModel}