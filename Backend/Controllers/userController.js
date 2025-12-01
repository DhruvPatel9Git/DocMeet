const { doctorSigninModel } = require('../Models/doctorModel');
const { userSignUpModel } = require('../Models/authModel')
const { appointmentModel } = require('../Models/appointmentModel')
const mongoose = require('mongoose');


// controllers/userController.js
const admin = require("firebase-admin");
const getFullUserData = async (req, res) => {
    const email = req.user.email;
    if (!email) {
        return res.status(400).json({ isSuccess: false, msg: "Email is required in query" });
    }

    try {
        // Fetch user by email
        const user = await userSignUpModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ isSuccess: false, msg: "User not found" });
        }

        res.status(200).json({
            isSuccess: true,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                picture: user.picture,
                loginMethod: user.loginMethod,
                userBirthDay: user.userBirthDay,
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ isSuccess: false, msg: "Server error" });
    }
};

const getDoctorImages = async (req, res) => {
    try {
        const getDoctorData = await doctorSigninModel.find({}).select('doctorName doctorImage doctorSpeciality doctorTimmings doctorAvailableDays')
        res.send({
            data: getDoctorData
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const getPediatriciansDoctors = async (req, res) => {
    try {
        const getDoctorData1 = await doctorSigninModel.find({ doctorSpeciality: "Pediatricians" })
        res.send({
            data: getDoctorData1
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const getDermatologistDoctors = async (req, res) => {
    try {
        const getDoctorData2 = await doctorSigninModel.find({ doctorSpeciality: "Dermatologist" })
        res.send({
            data: getDoctorData2
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const getGynecologistDoctors = async (req, res) => {
    try {
        const getDoctorData3 = await doctorSigninModel.find({ doctorSpeciality: "Gynecologist" })
        res.send({
            data: getDoctorData3
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const getGeneralPhysician = async (req, res) => {
    try {
        const getDoctorData4 = await doctorSigninModel.find({ doctorSpeciality: "General Physician" })
        res.send({
            data: getDoctorData4
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const getNeurologist = async (req, res) => {
    try {
        const getDoctorData5 = await doctorSigninModel.find({ doctorSpeciality: "Neurologist" })
        res.send({
            data: getDoctorData5
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const getGastroenterologist = async (req, res) => {
    try {
        const getDoctorData6 = await doctorSigninModel.find({ doctorSpeciality: "Gastroenterologist" })
        res.send({
            data: getDoctorData6
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const userDashboardName = async (req, res) => {
    const user = await userSignUpModel.findOne({ email: req.user.email });
    try {
        if (user) {
            res.send({
                user
            })
        }
    } catch {
        res.send({
            msg: "NotFound"
        })
    }
}

const verifyUser = async (req, res) => {
    userSignUpModel.updateOne({ email: req.user.email }, req.body)
        .then((data) => {
            console.log(data)
            res.send({ msg: "Update Data Successfully" })
        })
        .catch((err) => {
            console.log(err)
        })
}

const allDoctors = async (req, res) => {
    try {
        const getAllDoctorData = await doctorSigninModel.find()
        res.send({
            data: getAllDoctorData
        })
    }
    catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const partDoc = async (req, res) => {
    const { _id } = req.params;
    const objectId = new mongoose.Types.ObjectId(_id);
    console.log(_id)
    try {
        const user = await doctorSigninModel.findById(objectId)
        if (user) {
            res.send({
                data: user
            })
        }
    } catch (err) {
        res.send({
            err: err
        })
        console.log(err)
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const email = req.query.email?.trim()?.toLowerCase(); // sanitize email
        const { fullname, userBirthDay } = req.body;

        const updateFields = {
            fullname,
            userBirthDay: new Date(userBirthDay), // convert string to date
        };

        console.log('Body:', req.body);
        console.log('Birthday type:', typeof userBirthDay);

        if (req.file) {
            updateFields.picture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updatedUser = await userSignUpModel.findOneAndUpdate(
            { email: { $regex: new RegExp(`^${email}$`, 'i') } },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
};

const getUser = async (req, res) => {
    const { email } = req.user
    try {
        const data = await userSignUpModel.findOne({ email })
        res.send({
            user: data
        })
    }
    catch (err) {
        console.log(err)
    }
}
const bookAppointment = async (req, res) => {
    const { userID, doctorID, slotTime, slotDate, slotDay, monthNum } = req.body;
    console.log(monthNum)
    try {
        const tempData = appointmentModel.find({
            userID: userID,
            doctorID: doctorID,
            slotTime: slotTime,
            slotDate: slotDate,
            slotDay: slotDay,
            monthNum: monthNum
        })
        if (tempData.length > 0) {
            const updateResult = await appointmentModel.updateOne({
                userID: userID,
                doctorID: doctorID,
                slotTime: slotTime,
                slotDay: slotDay,
                slotDate: slotDate
              }, { $set: { status : 'pending' } })

            if (updateResult.modifiedCount > 0) {
            res.send({ msg: true });
            console.log("success")
            } else {
            res.send({ msg: false });
            console.log("not")
            }
        } else {
            const currentYear = new Date().getFullYear();
            const [dayStr, monthStr] = slotDate.split(" ");
            const day = parseInt(dayStr);

            const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sept: 8, Oct: 9, Nov: 10, Dec: 11
            };

            const month = monthMap[monthStr];

            let [timePart, meridian] = slotTime.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);

            if (meridian === "PM" && hours !== 12) hours += 12;
            if (meridian === "AM" && hours === 12) hours = 0;

            // Directly construct Date
            const newDate = new Date(currentYear, month, day, hours, minutes, 0, 0);

            const appointData = new appointmentModel({
                userID,
                doctorID,
                slotTime,
                slotDate,
                slotDay,
                monthNum,
                newDate
            });

            await appointData.save();
            res.send({ appointBooked: "Yes Booked !" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).send({ appointBooked: "NO Booked !" });
    }
};



const getUserAppointments = async (req, res) => {
    const { _id } = req.params;
    const getAppointmentsDetails = await appointmentModel.find({ userID: _id }).populate("doctorID").populate("userID");
    try {
        if (getAppointmentsDetails) {
            res.send({
                appointments: getAppointmentsDetails
            })
        }
    } catch {
        res.send({
            appointments: "NotFound"
        })
    }
}

const getAppointmentsForHide = async (req, res) => {
    const getAppointmentsDetails = await appointmentModel.find({}).populate("doctorID").populate("userID");
    try {
        if (getAppointmentsDetails) {
            res.send({
                appointments: getAppointmentsDetails
            })
        }
    } catch {
        res.send({
            appointments: "NotFound"
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const data = await userSignUpModel.find(); // find all users
        res.send({
            users: data
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal server error" });
    }
};





module.exports = { getAppointmentsForHide, getAllUsers, updateUserProfile, getDoctorImages, getPediatriciansDoctors, getDermatologistDoctors, getGynecologistDoctors, getGeneralPhysician, getNeurologist, getGastroenterologist, userDashboardName, verifyUser, allDoctors, partDoc, getFullUserData, getUser, bookAppointment, getUserAppointments }
