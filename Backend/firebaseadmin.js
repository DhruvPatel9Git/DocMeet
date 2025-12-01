const admin = require("firebase-admin");

if (!process.env.FIREBASE_SA) {
  throw new Error("FIREBASE_SA environment variable is missing");
}

// Convert JSON string from env var into an object
const serviceAccount = JSON.parse(process.env.FIREBASE_SA);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://<your-project-id>.firebaseio.com" // add only if needed
});

module.exports = admin;
