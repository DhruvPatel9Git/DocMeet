// One-off test script: upload a single file from ./doctorImages to Cloudinary
// Usage: node testUploadSingle.js [filename]
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { uploadToCloudinary } = require("./cloudinaryConfig");

const filenameArg = process.argv[2] || "Namra.png";
const imagesDir = path.join(__dirname, "doctorImages");
const filePath = path.join(imagesDir, filenameArg);

async function main() {
  console.log("Test upload script starting");
  if (!fs.existsSync(filePath)) {
    console.error("Local file not found:", filePath);
    console.error(
      "Files in",
      imagesDir,
      ":",
      fs.readdirSync(imagesDir).join(", ")
    );
    process.exit(1);
  }

  const buffer = fs.readFileSync(filePath);
  try {
    const cloudFolder = process.env.CLOUDINARY_FOLDER || "test_uploads";
    console.log(
      `Uploading ${filenameArg} to Cloudinary folder: ${cloudFolder}`
    );
    const result = await uploadToCloudinary(buffer, filenameArg, cloudFolder);
    console.log("Upload result:");
    console.log(result);
    console.log("secure_url:", result && result.secure_url);
    console.log("public_id:", result && result.public_id);
  } catch (err) {
    console.error("Upload failed:", err && err.message ? err.message : err);
    process.exit(1);
  }

  process.exit(0);
}

main();
