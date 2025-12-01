import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "https://docmeet1.onrender.com/docmeet/admin/getDoctors"
      );
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `https://docmeet1.onrender.com/docmeet/admin/deleteDoctor/${id}`
      );
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor", err);
    }
  };

  const handleEdit = (doctor) => {
    navigate(`/admin/EditDoctor/${doctor}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="p-6 w-full">
        <h2 className="text-2xl font-semibold mb-6">Doctor List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Doctor Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Degree</th>
              <th className="border px-4 py-2">Speciality</th>
              <th className="border px-4 py-2">Fees</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No doctors found.
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{doc.doctorName}</td>
                  <td className="border px-4 py-2">{doc.doctorEmail}</td>
                  <td className="border px-4 py-2">{doc.doctorDegree}</td>
                  <td className="border px-4 py-2">{doc.doctorSpeciality}</td>
                  <td className="border px-4 py-2">{doc.doctorFees}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(doc._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(doc._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorList;
