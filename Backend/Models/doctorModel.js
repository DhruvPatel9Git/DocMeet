const joi = require('joi');
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorName:{
        type: String,
        required: true,
    },
    doctorEmail:{
        type: String,
        required: true,
    },
    doctorPassword:{
        type: String,
        required: true,
    },
    doctorExperience:{
        type:Number,
        required:true,
    },
    doctorDegree:{
        type: String,
        required: true,
    },
    doctorAddress:{
        type: String,
        required: true,
    },
    doctorSpeciality:{
        type: String,
        required: true,
    },
    doctorFees:{
        type: Number,
        required: true,
    },
    doctorTimmings:{
        type:{
            doctorStart:{type: String},
            doctorEnd:{type: String}
        }
    },
    doctorAvailableDays: {
        type: [String],
        enum: {
          values: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          message: '{VALUE} is not a valid day'
        },
        required: true
    },
    doctorPhno:{
        type: String,
        required: true
    },
    doctorRating:{
        type: Number,
        required: true,
    },
    doctorImage:{
        type:{
            imgPath : {type:String},
            imgName : {type:String}
        }
    },
    doctorDesc:{
        type: String,
        required: true
    },
    slotDuration:{
        type: Number,
        required: true
    }
});

const prescriptionSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
    required: true,
  },
  prescriptionPhoto: {
    imgPath: {
      type: String,
      required: true,
    },
    imgName: {
      type: String,
      required: true,
    },
  },
});

const medicineSchema=new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
      },
      medicineInfo: {
        type: String,
        required: true,
      }, 
})

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true
  },
  image: {
    type: String // store image path or filename
  }
});


const Prescription = mongoose.model('Prescription', prescriptionSchema);
const doctorSigninModel = mongoose.model('Doctor', doctorSchema);
const MedicineModel = mongoose.model('medicine', medicineSchema);
const departmentSchema1 = mongoose.model('department', departmentSchema);
module.exports = {doctorSigninModel,Prescription,MedicineModel,departmentSchema1};
