const express = require("express");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();
require("./dbconfig");
const path = require("path");

app.use("/doctorImages", express.static(path.join(__dirname, "doctorImages")));
app.use(
  "/doctorAddedPrescriptions",
  express.static(path.join(__dirname, "doctorAddedPrescription"))
);
app.use("/picture", express.static(path.join(__dirname, "picture")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads1", express.static("uploads1"));

const mainRoutes = require("./Routes/mainRoutes");
app.use("/docmeet", mainRoutes);

app.listen(5001, (err) => {
  if (!err) {
    console.log("server started at 5001 port");
  } else {
    console.log("server not started at 5001 port", err);
  }
});
