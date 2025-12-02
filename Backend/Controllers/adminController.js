const fs = require("fs");
const path = require("path");
const { uploadToCloudinary } = require("../cloudinaryConfig");
const adminSignInModel = require("../Models/adminModel");
const {
  doctorSigninModel,
  departmentSchema1,
} = require("../Models/doctorModel");
const { nurseModel } = require("../Models/nurseModel");

const adminSignin = (req, res) => {
  let adminSignInData = new adminSignInModel({
    email: req.body.email,
    password: req.body.password,
  });
  res.send(adminSignInData);
};

const doctorSignin = async (req, res) => {
  try {
    // If uploaded via memoryStorage, file buffer is available at req.file.buffer
    // multer.diskStorage may instead provide req.file.path or req.file.filename
    let imgInfo = null;
    let localSavedName = null;
    if (req.file) {
      console.log("Received req.file on doctor add:", {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      });
    }

    if (req.file && req.file.buffer) {
      // Upload to Cloudinary (preferred). Do not save local copy unless explicitly enabled.
      try {
        imgInfo = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "doctors"
        );
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
      }

      // Optional: save a local copy only when SAVE_LOCAL_UPLOADS=true
      if (process.env.SAVE_LOCAL_UPLOADS === "true") {
        try {
          const imagesDir = path.join(__dirname, "..", "doctorImages");
          if (!fs.existsSync(imagesDir))
            fs.mkdirSync(imagesDir, { recursive: true });
          const safeName = `${Date.now()}-${req.file.originalname.replace(
            /[^a-zA-Z0-9.\-_]/g,
            ""
          )}`;
          const localPath = path.join(imagesDir, safeName);
          fs.writeFileSync(localPath, req.file.buffer);
          localSavedName = safeName;
          console.log(`Saved local copy of upload: ${localSavedName}`);
        } catch (saveErr) {
          console.error("Failed to save local copy of uploaded file:", saveErr);
        }
      }
    } else if (req.file && req.file.path) {
      // If multer saved the file to disk (diskStorage), we still upload that file to Cloudinary
      try {
        const buffer = fs.readFileSync(req.file.path);
        try {
          imgInfo = await uploadToCloudinary(
            buffer,
            req.file.originalname,
            "doctors"
          );
        } catch (uploadErr) {
          console.error(
            "Cloudinary upload error (disk-stored file):",
            uploadErr
          );
        }
      } catch (readErr) {
        console.error("Failed to read disk-stored uploaded file:", readErr);
      }

      // Optionally keep local file only if configured
      if (process.env.SAVE_LOCAL_UPLOADS === "true") {
        try {
          const imagesDir = path.join(__dirname, "..", "doctorImages");
          if (!fs.existsSync(imagesDir))
            fs.mkdirSync(imagesDir, { recursive: true });
          const src = req.file.path;
          const destName = `${Date.now()}-${req.file.originalname.replace(
            /[^a-zA-Z0-9.\-_]/g,
            ""
          )}`;
          const dest = path.join(imagesDir, destName);
          fs.copyFileSync(src, dest);
          localSavedName = destName;
          console.log(`Copied disk-stored upload to doctorImages: ${destName}`);
        } catch (copyErr) {
          console.error("Failed to copy disk-stored uploaded file:", copyErr);
        }
      }
    }

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
        doctorEnd: req.body.doctorEnd,
      },
      doctorImage: imgInfo
        ? { imgPath: imgInfo.secure_url, imgName: imgInfo.public_id }
        : localSavedName
        ? {
            imgPath: `/doctorImages/${localSavedName}`,
            imgName: localSavedName,
          }
        : null,
      doctorPhno: req.body.doctorPhno,
      doctorRating: req.body.doctorRating,
      slotDuration: req.body.slotDuration,
    });
    await doctorSignInData.save();
    // Log and return the stored image URL (Cloudinary secure_url or local path)
    const storedImgPath = doctorSignInData.doctorImage
      ? doctorSignInData.doctorImage.imgPath
      : null;
    console.log(`Doctor added. imagePath: ${storedImgPath}`);
    res.status(201).send({
      msg: "Doctor Added",
      imagePath: storedImgPath,
      doctor: doctorSignInData,
    });
  } catch (err) {
    res.send({ msg: err });
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
    const doctors = await doctorSigninModel.find(
      {},
      {
        doctorName: 1,
        doctorEmail: 1,
        doctorDegree: 1,
        doctorSpeciality: 1,
        doctorFees: 1,
        _id: 1,
      }
    );
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
    if (req.file) {
      console.log("Received req.file on doctor update:", {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      });
    }

    const doctorTimmings =
      typeof req.body.doctorTimmings === "string"
        ? JSON.parse(req.body.doctorTimmings)
        : req.body.doctorTimmings;

    const doctorAvailableDays =
      typeof req.body.doctorAvailableDays === "string"
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
      slotDuration: req.body.slotDuration,
    };

    if (req.file) {
      // Upload to Cloudinary using buffer if present, otherwise read disk file
      try {
        let imgInfo = null;
        if (req.file.buffer) {
          imgInfo = await uploadToCloudinary(
            req.file.buffer,
            req.file.originalname,
            "doctors"
          );
        } else if (req.file.path) {
          const buffer = fs.readFileSync(req.file.path);
          imgInfo = await uploadToCloudinary(
            buffer,
            req.file.originalname,
            "doctors"
          );
        }

        if (imgInfo) {
          updatedFields.doctorImage = {
            imgPath: imgInfo.secure_url,
            imgName: imgInfo.public_id,
          };
        }
      } catch (uploadErr) {
        console.error("Cloudinary upload error during update:", uploadErr);
      }

      // Save local copy only when SAVE_LOCAL_UPLOADS=true
      if (process.env.SAVE_LOCAL_UPLOADS === "true") {
        try {
          const imagesDir = path.join(__dirname, "..", "doctorImages");
          if (!fs.existsSync(imagesDir))
            fs.mkdirSync(imagesDir, { recursive: true });
          const safeName = `${Date.now()}-${req.file.originalname.replace(
            /[^a-zA-Z0-9.\-_]/g,
            ""
          )}`;
          const localPath = path.join(imagesDir, safeName);
          if (req.file.buffer) {
            fs.writeFileSync(localPath, req.file.buffer);
          } else if (req.file.path) {
            fs.copyFileSync(req.file.path, localPath);
          }
          if (!updatedFields.doctorImage) {
            updatedFields.doctorImage = {
              imgPath: `/doctorImages/${safeName}`,
              imgName: safeName,
            };
          }
          console.log(`Saved local copy of updated upload: ${safeName}`);
        } catch (saveErr) {
          console.error("Failed to save local copy during update:", saveErr);
        }
      }
    }

    const updatedDoctor = await doctorSigninModel.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).send({ msg: "Doctor not found" });
    }

    // Log and return the image URL for the updated doctor
    const updatedImgPath = updatedDoctor.doctorImage
      ? updatedDoctor.doctorImage.imgPath
      : null;
    console.log(`Doctor updated. imagePath: ${updatedImgPath}`);
    res.status(200).send({
      msg: "Doctor updated successfully",
      data: updatedDoctor,
      imagePath: updatedImgPath,
    });
  } catch (err) {
    console.error("Update error:", err);
    res
      .status(500)
      .send({ msg: "Failed to update doctor", error: err.message });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { departmentName } = req.body;

    let imagePath = null;
    if (req.file && req.file.buffer) {
      try {
        const info = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "departments"
        );
        imagePath = info.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error for department:", uploadErr);
      }
    }

    const newDept = new departmentSchema1({
      departmentName,
      image: imagePath,
    });

    await newDept.save();
    res.status(200).json({ message: "Department added successfully" });
  } catch (error) {
    console.error("Server Error in addDepartment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getdepartment = async (req, res) => {
  try {
    const departments = await departmentSchema1.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    await departmentSchema1.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Error deleting department:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getSingleDepartment = async (req, res) => {
  try {
    const department = await departmentSchema1.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getSingleDepartment };

const editDepartment = async (req, res) => {
  try {
    const { departmentName } = req.body;
    const updateData = {
      departmentName,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await departmentSchema1.findByIdAndUpdate(req.params.id, updateData);
    try {
      const info = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "departments"
      );
      updateData.image = info.secure_url;
    } catch (uploadErr) {
      console.error("Cloudinary upload error for editDepartment:", uploadErr);
    }
  } catch (err) {
    console.error("Error updating department:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addNurse = async (req, res) => {
  const { nurseName, nurseEmail, nursePassword, nurseAge, doctorID } = req.body;
  try {
    if (!nurseName || !nurseEmail || !nursePassword || !nurseAge || !doctorID) {
      res.send({ nurseRes: "Pls Filled All Details" });
      return;
    }

    const nurseData = new nurseModel({
      doctorID,
      nurseName,
      nurseEmail,
      nursePassword,
      nurseAge,
    });

    const savedNurse = await nurseData.save();

    if (savedNurse) {
      res.status(201).json({ nurseData: savedNurse });
    }
  } catch (err) {
    res.send({
      nurseRes: err,
    });
  }
};

module.exports = {
  addNurse,
  editDepartment,
  getSingleDepartment,
  addDepartment,
  adminSignin,
  doctorSignin,
  getDoctors,
  deleteDoctor,
  updateDoctor,
  getDoctorById,
  getdepartment,
  deleteDepartment,
};
