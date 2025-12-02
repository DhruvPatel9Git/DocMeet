const {
  Prescription,
  MedicineModel,
  doctorSigninModel,
} = require("../Models/doctorModel");
const { appointmentModel } = require("../Models/appointmentModel");

const addPrescription = async (req, res) => {
  try {
    const { patientName, patientEmail, additionalInfo } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const newPrescription = new Prescription({
      patientName,
      patientEmail,
      additionalInfo,
      prescriptionPhoto: {
        imgPath: `http://localhost:5000/doctorAddedPrescriptions/${file.originalname}`,
        imgName: file.originalname,
      },
    });

    await newPrescription.save();
    res
      .status(201)
      .json({ msg: "Prescription added successfully", data: newPrescription });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error });
  }
};

const addMedicine = async (req, res) => {
  try {
    const { medicineName, medicineInfo } = req.body;

    if (!medicineName || !medicineInfo) {
      return res
        .status(400)
        .json({ msg: "Both medicineName and medicineInfo are required" });
    }

    const newMedicine = new MedicineModel({ medicineName, medicineInfo });
    await newMedicine.save();

    res
      .status(201)
      .json({ msg: "Medicine added successfully", data: newMedicine });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Something went wrong", error });
  }
};

const doctorDashboardName = async (req, res) => {
  const doctor = await doctorSigninModel.findOne({
    doctorEmail: req.doctor.doctorEmail,
  });
  try {
    if (doctor) {
      res.send({
        doctor,
      });
    }
  } catch {
    res.send({
      msg: "NotFound",
    });
  }
};

const getAppointments = async (req, res) => {
  const months = [
    {
      1: "jan",
      2: "Feb",
      3: "Mar",
      4: "April",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    },
  ];
  let date = new Date();
  let dateNumber = date.getDate();
  let monthName = date.toLocaleString("default", { month: "short" });
  const monthNumArray = months.map((val, index) => {
    for (const key in val) {
      if (val[key] == monthName) {
        return key;
      }
    }
  });
  const monthNumCheck = Number(monthNumArray.find(Boolean));
  console.log(monthName);
  let fullDate = dateNumber + " " + monthName;
  const getAppointmentsDetails = await appointmentModel
    .find({
      doctorID: req.doctor._id,
      newDate: { $gt: date },
      monthNum: { $gte: monthNumCheck },
      slotDate: { $ne: fullDate },
    })
    .populate("doctorID")
    .populate("userID");

  try {
    if (getAppointmentsDetails) {
      res.send({
        appointments: getAppointmentsDetails,
      });
    }
  } catch {
    res.send({
      appointments: "NotFound",
    });
  }
};

// const getAppointmentsPast = async (req, res) => {
//   const months = [{ 1: "jan", 2: "Feb", 3: "Mar", 4: "April", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" }];
//   let date = new Date();
//   let dateNumber = date.getDate();
//   let monthName = date.toLocaleString('default', { month: 'short' });
//   const monthNumArray = months.map((val, index) => {
//     for (const key in val) {
//       if (val[key] == monthName) {
//         return key;
//       }
//     }
//   });
//   const monthNumCheck = Number(monthNumArray.find(Boolean));

//   console.log(monthName)
//   let fullDate = dateNumber + " " + monthName;

//   const getAppointmentsDetails = await appointmentModel.find({ doctorID: req.doctor._id, newDate: { $lt: date }}).populate("doctorID").populate("userID")

//   try {
//     if (getAppointmentsDetails) {
//       res.send({
//         appointments: getAppointmentsDetails
//       })
//     }
//   } catch {
//     res.send({
//       appointments: "NotFound"
//     })
//   }
// }

const getAppointmentsPast = async (req, res) => {
  try {
    const currentDate = new Date(); // Current system time
    console.log("System Local Time:", currentDate);
    console.log("System UTC Time:", currentDate.toISOString());

    // Confirm doctorID type handling
    const doctorIdString = req.doctor._id.toString();

    // Fetch all appointments for doctor for sanity check
    const allAppointments = await appointmentModel.find({
      doctorID: doctorIdString,
    });
    console.log("Total Appointments for Doctor:", allAppointments.length);

    allAppointments.forEach((app, index) => {
      console.log(
        `${index + 1}) slotDate: ${app.slotDate}, newDate: ${
          app.newDate ? app.newDate.toISOString() : "N/A"
        }`
      );
    });

    // Fetch past appointments
    const getAppointmentsDetails = await appointmentModel
      .find({
        doctorID: req.doctor._id,
        newDate: { $lt: currentDate }, // Past appointments
      })
      .populate("doctorID")
      .populate("userID");

    console.log("Past Appointments Found:", getAppointmentsDetails.length);

    if (getAppointmentsDetails && getAppointmentsDetails.length > 0) {
      res.send({
        aRes: getAppointmentsDetails,
      });
    } else {
      res.send({ aRes: [] });
    }
  } catch (err) {
    console.log("Error Occurred:", err);
    res.send({
      aRes: "Error Occurred",
    });
  }
};

const getAppointmentsToday = async (req, res) => {
  let date = new Date();
  let dateNumber = date.getDate();
  let monthName = date.toLocaleString("default", { month: "short" });

  let fullDate = dateNumber + " " + monthName;
  const getAppointmentsDetails = await appointmentModel
    .find({ doctorID: req.doctor._id, slotDate: { $eq: fullDate } })
    .populate("doctorID")
    .populate("userID");
  try {
    if (getAppointmentsDetails) {
      res.send({
        appointments: getAppointmentsDetails,
      });
    }
  } catch {
    res.send({
      appointments: "NotFound",
    });
  }
};

const updatestatuspostive = async (req, res) => {
  const { userID, doctorID, slotTime, slotDay, slotDate, status } = req.body;
  try {
    const updateResult = await appointmentModel.updateOne(
      {
        userID: userID,
        doctorID: doctorID,
        slotTime: slotTime,
        slotDay: slotDay,
        slotDate: slotDate,
      },
      { $set: { status: status } }
    );

    if (updateResult.modifiedCount > 0) {
      res.send({ msg: "StatusUpdated" });
    } else {
      res.send({ msg: "Appointment not found or already updated" });
    }
  } catch {
    res.send({
      msg: "NotStatusUpdated",
    });
  }
};

const updatestatusnegative = async (req, res) => {
  const { userID, doctorID, slotTime, slotDay, slotDate, status } = req.body;
  try {
    const updateResult = await appointmentModel.updateOne(
      {
        userID: userID,
        doctorID: doctorID,
        slotTime: slotTime,
        slotDay: slotDay,
        slotDate: slotDate,
      },
      { $set: { status: status } }
    );

    if (updateResult.modifiedCount > 0) {
      res.send({ msg: "StatusUpdated" });
    } else {
      res.send({ msg: "Appointment not found or already updated" });
    }
  } catch {
    res.send({
      msg: "NotStatusUpdated",
    });
  }
};

const filterMonth = async (req, res) => {
  const { filtermonth } = req.params;
  console.log(filterMonth);
  try {
    const filterData = await appointmentModel
      .find({ monthNum: filtermonth })
      .populate("userID");
    if (filterData) {
      res.send({
        filter: filterData,
      });
    }
  } catch {
    res.send({
      msg: "Not",
    });
  }
};

const filterStatus = async (req, res) => {
  const { filterstatus } = req.params;
  console.log(filterstatus);
  try {
    const filterData = await appointmentModel
      .find({ status: { $eq: filterstatus } })
      .populate("userID");
    if (filterData) {
      res.send({
        filter: filterData,
      });
    }
  } catch {
    res.send({
      msg: "Not",
    });
  }
};

const completedAppointment1 = async (req, res) => {
  const {
    userID,
    doctorID,
    slotTime,
    slotDay,
    slotDate,
    status,
    completedAppointment,
  } = req.body;
  try {
    const updateResult = await appointmentModel.updateOne(
      {
        userID: userID,
        doctorID: doctorID,
        slotTime: slotTime,
        slotDay: slotDay,
        slotDate: slotDate,
        status: status,
      },
      { $set: { completedAppointment: completedAppointment } }
    );

    if (updateResult.modifiedCount > 0) {
      res.send({ msg: true });
      console.log("success");
    } else {
      res.send({ msg: false });
      console.log("not");
    }
  } catch {
    res.send({
      msg: "NotStatusUpdated",
    });
  }
};

const filterData1 = async (req, res) => {
  const { _id } = req.params;
  try {
    const filterData = await appointmentModel.find({ _id: _id });
    if (filterData) {
      res.send({
        filterData: filterData,
      });
    }
  } catch (err) {
    res.send({
      msg: "Not found",
    });
  }
};

const getPrescriptionsByEmail = async (req, res) => {
  try {
    const { patientEmail } = req.params;

    if (!patientEmail) {
      return res.status(400).json({ msg: "Patient email is required" });
    }

    const prescriptions = await Prescription.find({ patientEmail });

    if (!prescriptions || prescriptions.length === 0) {
      return res
        .status(200)
        .json({ msg: "No prescriptions found", prescriptions: [] });
    }

    res
      .status(200)
      .json({ msg: "Prescriptions fetched successfully", prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ msg: "Something went wrong", error });
  }
};

module.exports = {
  filterData1,
  completedAppointment1,
  getAppointmentsPast,
  filterStatus,
  filterMonth,
  addPrescription,
  addMedicine,
  doctorDashboardName,
  getAppointments,
  updatestatuspostive,
  updatestatusnegative,
  getAppointmentsToday,
  getPrescriptionsByEmail,
};
