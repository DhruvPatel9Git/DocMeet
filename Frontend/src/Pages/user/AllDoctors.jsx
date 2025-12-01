import React, { useEffect, useState } from "react";
import "aos/dist/aos.css";
import img from "../../assets/images/image.png";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

function AllDoctors() {
  const [storeDoctorData, setStoreDoctorData] = useState([]);
  const [status1, setStatus1] = useState("all");
  useEffect(() => {
    axios
      .get(
        `https://docmeet1.onrender.com/docmeet/user/${
          status1 === "all" ? "allDoctors" : status1
        }`
      )
      .then((res) => {
        console.log("going on");
        console.log(res.data.data);
        setStoreDoctorData(res.data.data);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  }, [status1]);
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  return (
    <div>
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Left Sidebar: Category Filter */}
        <aside className="w-full sm:w-1/6">
          <div className="flex flex-col gap-3">
            {[
              { label: "All Doctors", value: "alldoctors" },
              { label: "Pediatricians", value: "getPediatriciansDoctors" },
              { label: "Dermatologists", value: "getDermatologistDoctors" },
              { label: "Gynecologist", value: "getGynecologistDoctors" },
              { label: "GeneralPhysician", value: "getGeneralPhysician" },
              { label: "Neurologist", value: "getNeurologist" },
              { label: "Gastroenterologist", value: "getGastroenterologist" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setStatus1(value)}
                className={`text-left px-4 py-2 rounded-md border font-medium transition 
                        ${
                          status1 === value
                            ? "bg-[#5D6BFF] text-white border-[#5D6BFF]"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-blue-100"
                        }`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>
        <main className="w-full sm:w-5/6">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {storeDoctorData?.map((val) => {
              const isTodayAvailable =
                val.doctorAvailableDays.includes(dayName);
              const isAvailable =
                formattedTime > val.doctorTimmings.doctorStart &&
                formattedTime < val.doctorTimmings.doctorEnd &&
                isTodayAvailable;
              return (
                <Link
                  to={`/user/partDoc/${val._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex flex-col items-center space-y-2 border p-3 bg-white shadow-lg"
                  >
                    <img
                      src={val.doctorImage?.imgPath}
                      className="bg-[#5D6BFF]"
                    />
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isAvailable ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`font-medium text-sm ${
                          isAvailable ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isAvailable ? "Available" : "Not Available"}
                      </span>
                    </div>

                    <span className="font-bold">{val.doctorName}</span>
                    <span className="font-semibold">
                      {val.doctorSpeciality}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AllDoctors;
