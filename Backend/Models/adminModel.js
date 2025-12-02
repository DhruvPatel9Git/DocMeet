//new file added
const { types } = require('joi');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});



const adminSignInModel = mongoose.model('Admin', adminSchema);
module.exports = adminSignInModel;

