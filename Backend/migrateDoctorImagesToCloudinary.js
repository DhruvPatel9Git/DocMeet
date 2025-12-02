/*
 One-off migration script:
 - Finds doctor documents whose `doctorImage.imgPath` points to local `http://localhost:5000/doctorImages/...` or relative `doctorImages/...` paths
 - Reads the file from `./doctorImages/<filename>`
 - Uploads it to Cloudinary (uses `cloudinaryConfig.uploadToCloudinary`)
 - Updates the doctor document `doctorImage.imgPath` to the returned `secure_url` and `doctorImage.imgName` to the Cloudinary public_id

 Usage (from Backend folder):
   node migrateDoctorImagesToCloudinary.js

 Prerequisites:
 - Set Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 - Set MONGO_URI env var (same as the app uses)
 - Ensure the local folder `doctorImages/` contains the files referenced in the DB
*/

const fs = require("fs");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("./cloudinaryConfig");
const { doctorSigninModel } = require("./Models/doctorModel");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not set in environment. Aborting.");
  process.exit(1);
}

async function connectDb() {
  await mongoose.connect(MONGO_URI);
}

function filenameFromPath(imgPath) {
  if (!imgPath) return null;
  // handle http://localhost:5000/doctorImages/Foo.png or /doctorImages/Foo.png or doctorImages/Foo.png
  const parts = imgPath.split("/");
  return parts[parts.length - 1];
}

function findLocalFileCaseInsensitive(dir, filename) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const lower = filename.toLowerCase();
  for (const f of files) {
    if (f.toLowerCase() === lower) return f;
  }
  return null;
}
function findLocalFileFuzzy(dir, filename) {
  // try to match by substring: remove digits and compare
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const base = filename.replace(/\d+/g, "").toLowerCase();
  for (const f of files) {
    if (f.toLowerCase().includes(base) || base.includes(f.toLowerCase()))
      return f;
  }
  return null;
}

async function migrate() {
  await connectDb();
  console.log("Connected to MongoDB");

  const doctors = await doctorSigninModel.find({
    "doctorImage.imgPath": { $exists: true, $ne: null },
  });
  console.log(`Found ${doctors.length} doctors with doctorImage`);

  for (const doc of doctors) {
    try {
      const imgPath = doc.doctorImage && doc.doctorImage.imgPath;
      if (!imgPath) continue;

      // If imgPath already looks like Cloudinary HTTPS, skip
      if (
        imgPath.startsWith("https://res.cloudinary.com") ||
        imgPath.startsWith("https://cloudinary.com")
      ) {
        console.log(`${doc._id}: already Cloudinary, skipping`);
        continue;
      }

      const filename = filenameFromPath(imgPath);
      if (!filename) {
        console.warn(`${doc._id}: cannot extract filename from ${imgPath}`);
        continue;
      }

      const imagesDir = path.join(__dirname, "doctorImages");
      let localFilename = filename;
      let localFile = path.join(imagesDir, localFilename);

      if (!fs.existsSync(localFile)) {
        // try case-insensitive match (Windows vs Linux filenames)
        const matched = findLocalFileCaseInsensitive(imagesDir, filename);
        if (matched) {
          localFilename = matched;
          localFile = path.join(imagesDir, localFilename);
          console.log(
            `${doc._id}: found local file with case-insensitive match: ${localFilename}`
          );
        } else {
          // try fuzzy substring match (e.g., namra11.png -> Namra.png)
          const fuzzy = findLocalFileFuzzy(imagesDir, filename);
          if (fuzzy) {
            localFilename = fuzzy;
            localFile = path.join(imagesDir, localFilename);
            console.log(
              `${doc._id}: found local file with fuzzy match: ${localFilename}`
            );
          } else {
            console.warn(`${doc._id}: local file not found: ${localFile}`);
            continue;
          }
        }
      }

      const buffer = fs.readFileSync(localFile);
      console.log(`${doc._id}: uploading ${filename} to Cloudinary...`);

      const cloudFolder = process.env.CLOUDINARY_FOLDER || "migrated_doctors";
      const result = await uploadToCloudinary(
        buffer,
        localFilename,
        cloudFolder
      );
      console.log(`${doc._id}: uploaded -> ${result.secure_url}`);

      // Update only the doctorImage subfields to avoid triggering other schema validations
      try {
        await doctorSigninModel.findByIdAndUpdate(
          doc._id,
          {
            $set: {
              "doctorImage.imgPath": result.secure_url,
              "doctorImage.imgName": result.public_id,
            },
          },
          { new: true }
        );
        console.log(`${doc._id}: DB updated (doctorImage)`);
      } catch (updateErr) {
        console.error(
          `${doc._id}: Failed to update doctorImage in DB:`,
          updateErr.message || updateErr
        );
      }
    } catch (err) {
      console.error(
        `Error migrating doctor ${doc._id}:`,
        err && err.message ? err.message : err
      );
    }
  }

  console.log("Migration complete");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
