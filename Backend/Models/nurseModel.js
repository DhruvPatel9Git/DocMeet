const { required } = require('joi')
const mongoose = require('mongoose')

const nurseSchema = mongoose.Schema({
    doctorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Doctor"
    },
    nurseName : {
        type : String,
        required : true
    },
    nurseEmail : {
        type : String,
        required : true
    },
    nursePassword : {
        type : String,
        required : true
    },
    nurseAge : {
        type : Number,
        required : true
    }
})

const nurseModel = mongoose.model('nurseModel',nurseSchema)

module.exports = {nurseModel}