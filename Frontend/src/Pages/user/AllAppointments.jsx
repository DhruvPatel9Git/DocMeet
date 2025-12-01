import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Components/Common/AuthContext";

function UserAppointmentsPage() {
  const { userData } = useContext(AuthContext);
  const [appointmentsAll, setAppointmentsAll] = useState([]);
  const [prescriptions, setPrescriptions] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    if (!userData) return;

    axios
      .get(
        `https://docmeet1.onrender.com/docmeet/user/getUserAppointments/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setAppointmentsAll(res.data.appointments);
        // Fetch prescriptions for this user
        fetchPrescriptions(userData.email);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userData]);

  const fetchPrescriptions = (email) => {
    axios
      .get(
        `https://docmeet1.onrender.com/docmeet/doctor/getPrescriptions/${email}`
      )
      .then((res) => {
        // Create a map of prescriptions by patient email for easier lookup
        const prescriptionMap = {};
        if (res.data.prescriptions && res.data.prescriptions.length > 0) {
          res.data.prescriptions.forEach((prescription) => {
            if (!prescriptionMap[prescription.patientEmail]) {
              prescriptionMap[prescription.patientEmail] = [];
            }
            prescriptionMap[prescription.patientEmail].push(prescription);
          });
        }
        setPrescriptions(prescriptionMap);
      })
      .catch((err) => {
        console.log("Error fetching prescriptions:", err);
      });
  };

  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-2xl">
        <table className="min-w-full table-auto border-collapse text-sm text-gray-700">
          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Patient</th>
              <th className="px-6 py-3 text-left font-semibold">Time</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-center font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Doctor</th>
              <th className="px-6 py-3 text-center font-semibold">
                Prescription
              </th>
            </tr>
          </thead>
          <tbody>
            {appointmentsAll.length > 0 ? (
              appointmentsAll.map((val, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="hover:bg-indigo-50 transition duration-200 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <td className="px-6 py-4">{val.userID?.fullname}</td>
                    <td className="px-6 py-4">{val.slotTime}</td>
                    <td className="px-6 py-4">{val.slotDate}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          val.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : val.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {val.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{val.doctorID?.doctorName}</td>
                    <td className="px-6 py-4 text-center">
                      {prescriptions[userData?.email] &&
                      prescriptions[userData?.email].length > 0 ? (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition">
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                  </tr>
                  {/* Prescription Details Row */}
                  {expandedRow === index &&
                    prescriptions[userData?.email] &&
                    prescriptions[userData?.email].length > 0 && (
                      <tr className="bg-indigo-50">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                              Prescriptions
                            </h3>
                            {prescriptions[userData?.email].map(
                              (prescription, pIndex) => (
                                <div
                                  key={pIndex}
                                  className="bg-white p-4 rounded-lg border border-indigo-200"
                                >
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Patient Name
                                      </p>
                                      <p className="font-medium text-gray-700">
                                        {prescription.patientName}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Patient Email
                                      </p>
                                      <p className="font-medium text-gray-700">
                                        {prescription.patientEmail}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-500">
                                      Additional Info
                                    </p>
                                    <p className="font-medium text-gray-700">
                                      {prescription.additionalInfo}
                                    </p>
                                  </div>
                                  {prescription.prescriptionPhoto && (
                                    <div>
                                      <p className="text-sm text-gray-500 mb-2">
                                        Prescription Photo
                                      </p>
                                      <img
                                        src={
                                          prescription.prescriptionPhoto.imgPath
                                        }
                                        alt="Prescription"
                                        className="max-w-full h-auto rounded border border-gray-200 max-h-96"
                                      />
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  No appointments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserAppointmentsPage;
