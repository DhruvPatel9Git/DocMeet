const fs = require('fs')
const adminSignInModel = require('../Models/adminModel');
const { doctorSigninModel, departmentSchema1 } = require('../Models/doctorModel');
const {nurseModel} = require("../Models/nurseModel")

 const adminSignin = (req, res) => {
    let adminSignInData = new adminSignInModel({
        email: req.body.email,
        password: req.body.password,
    });
    res.send(adminSignInData);
};

const doctorSignin = async (req, res) => {
    try {
        fs.readFile(req.file.path, async (err, data) => {
            if (!err) {
                let doctorSignInData = new doctorSigninModel({
                    doctorName: req.body.doctorName,
                    doctorEmail: req.body.doctorEmail,
                    doctorPassword: req.body.doctorPassword,
                    doctorExperience: req.body.doctorExperience,
                    doctorDesc: req.body.doctorDesc,
                    doctorDegree: req.body.doctorDegree,
                    doctorAddress: req.body.doctorAddress,
                    doctorSpeciality: req.body.doctorSpeciality,
                    doctorFees: req.body.doctorFees,
                    doctorAvailableDays: JSON.parse(req.body.doctorAvailableDays),
                    doctorTimmings: {
                        doctorStart: req.body.doctorStart,
                        doctorEnd: req.body.doctorEnd
                    },
                    doctorImage: {
                        imgPath: `http://localhost:5001/doctorImages/${req.file.originalname}`,
                        imgName: req.file.originalname
                    },
                    doctorPhno: req.body.doctorPhno,
                    doctorRating: req.body.doctorRating,
                    slotDuration: req.body.slotDuration
                });
                await doctorSignInData.save()
                res.send({ msg: "Doctor Added" })
            }
        })
    }
    catch (err) {
        res.send({ msg: err })
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await doctorSigninModel.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ msg: "Doctor not found" });
        }
        res.status(200).json(doctor); // ✅ return whole doc, including nested fields
    } catch (err) {
        res.status(500).json({ msg: "Failed to get doctor", error: err.message });
    }
};


const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorSigninModel.find({}, {
            doctorName: 1,
            doctorEmail: 1,
            doctorDegree: 1,
            doctorSpeciality: 1,
            doctorFees: 1,
            _id: 1
        });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch doctors", error: err });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        await doctorSigninModel.findByIdAndDelete(doctorId);
        res.status(200).send({ msg: "Doctor deleted successfully" });
    } catch (err) {
        res.status(500).send({ msg: "Failed to delete doctor", error: err });
    }
};
const updateDoctor = async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file);

        const doctorTimmings = typeof req.body.doctorTimmings === 'string'
            ? JSON.parse(req.body.doctorTimmings)
            : req.body.doctorTimmings;

        const doctorAvailableDays = typeof req.body.doctorAvailableDays === 'string'
            ? JSON.parse(req.body.doctorAvailableDays)
            : req.body.doctorAvailableDays;

        const updatedFields = {
            doctorName: req.body.doctorName,
            doctorEmail: req.body.doctorEmail,
            doctorPassword: req.body.doctorPassword,
            doctorExperience: req.body.doctorExperience,
            doctorDesc: req.body.doctorDesc,
            doctorDegree: req.body.doctorDegree,
            doctorAddress: req.body.doctorAddress,
            doctorSpeciality: req.body.doctorSpeciality,
            doctorFees: req.body.doctorFees,
            doctorAvailableDays,
            doctorTimmings,
            doctorPhno: req.body.doctorPhno,
            doctorRating: req.body.doctorRating,
            slotDuration: req.body.slotDuration
        };

        if (req.file) {
            updatedFields.doctorImage = {
                imgPath: `http://localhost:5001/doctorImages/${req.file.originalname}`,
                imgName: req.file.originalname
            };
        }

        const updatedDoctor = await doctorSigninModel.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).send({ msg: "Doctor not found" });
        }

        res.status(200).send({ msg: "Doctor updated successfully", data: updatedDoctor });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).send({ msg: "Failed to update doctor", error: err.message });
    }
};


const addDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;
        const imagePath = req.file ? req.file.filename : null;

        const newDept = new departmentSchema1({
            departmentName,
            image: imagePath,
        });

        await newDept.save();
        res.status(200).json({ message: 'Department added successfully' });

    } catch (error) {
        console.error('Server Error in addDepartment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getdepartment=async(req, res) => {
  try {
    const departments = await departmentSchema1.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const deleteDepartment = async (req, res) => {
  try {
    await departmentSchema1.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getSingleDepartment = async (req, res) => {
  try {
    const department = await departmentSchema1.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getSingleDepartment };

const editDepartment = async (req, res) => {
  try {
    const { departmentName } = req.body;
    const updateData = {
      departmentName
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await departmentSchema1.findByIdAndUpdate(req.params.id, updateData);
    res.status(200).json({ message: 'Department updated successfully' });
  } catch (err) {
    console.error('Error updating department:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addNurse = async (req,res) => {
    const {nurseName, nurseEmail, nursePassword, nurseAge, doctorID} = req.body
    try{
        if(!nurseName || !nurseEmail || !nursePassword || !nurseAge || !doctorID){
            res.send({nurseRes : "Pls Filled All Details"})
            return
        }

        const nurseData = new nurseModel({
            doctorID,
            nurseName,
            nurseEmail,
            nursePassword,
            nurseAge
        })

        const savedNurse = await nurseData.save();

        if(savedNurse){
            res.status(201).json({ nurseData: savedNurse });
        }
    }
    catch(err){
        res.send({
            nurseRes : err
        })
    }
}


module.exports = {addNurse,editDepartment,getSingleDepartment,addDepartment, adminSignin, doctorSignin, getDoctors, deleteDoctor, updateDoctor, getDoctorById,getdepartment,deleteDepartment};
