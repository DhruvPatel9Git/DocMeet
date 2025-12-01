import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddNurse() {
  const [nurseName, setNurseName] = useState("");
  const [nurseEmail, setNurseEmail] = useState("");
  const [nursePassword, setNursePassword] = useState("");
  const [nurseAge, setNurseAge] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://docmeet1.onrender.com/docmeet/user/allDoctors")
      .then((res) => {
        console.log(res.data.data);
        setDoctorList(res.data.data);
      })
      .catch((err) => {
        console.log("Error fetching doctors:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nurseData = {
      nurseName,
      nurseEmail,
      nursePassword,
      nurseAge,
      doctorID: selectedDoctor,
    };

    axios
      .post("https://docmeet1.onrender.com/docmeet/admin/addNurse", nurseData)
      .then((res) => {
        alert("Nurse added successfully!");
        console.log(res.data.nurseData);
      })
      .catch((err) => {
        console.log("Error adding nurse:", err);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />

      <div className="flex-grow flex justify-center items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Add Nurse
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Nurse Name
              </label>
              <input
                type="text"
                placeholder="Enter nurse name"
                value={nurseName}
                onChange={(e) => setNurseName(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Nurse Email
              </label>
              <input
                type="email"
                placeholder="Enter nurse email"
                value={nurseEmail}
                onChange={(e) => setNurseEmail(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Nurse Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={nursePassword}
                onChange={(e) => setNursePassword(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Nurse Age
              </label>
              <input
                type="number"
                placeholder="Enter nurse age"
                value={nurseAge}
                onChange={(e) => setNurseAge(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-2">Select Doctor</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctorList.length > 0 ? (
                  doctorList.map((doc) => (
                    <label
                      key={doc._id}
                      className={`flex items-center justify-between border rounded px-4 py-3 cursor-pointer transition 
                                            ${
                                              selectedDoctor === doc._id
                                                ? "border-[#5D6BFF] bg-blue-50"
                                                : "border-gray-300 hover:border-blue-400"
                                            }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="doctor"
                          value={doc._id}
                          checked={selectedDoctor === doc._id}
                          onChange={(e) => setSelectedDoctor(e.target.value)}
                          className="h-4 w-4 text-[#5D6BFF] focus:ring-[#5D6BFF] cursor-pointer"
                          required
                        />
                        <span className="text-gray-700 font-medium">
                          {doc.doctorName}
                        </span>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500">Loading doctors...</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5D6BFF] text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Nurse
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNurse;
