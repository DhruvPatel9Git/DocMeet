import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/image.png";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  FaTachometerAlt,
  FaCalendarPlus,
  FaUserMd,
  FaListUl,
  FaUser,
  FaCalendarCheck,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", appointments: 20 },
  { month: "Feb", appointments: 35 },
  { month: "Mar", appointments: 28 },
  { month: "Apr", appointments: 40 },
  { month: "May", appointments: 22 },
  { month: "Jun", appointments: 50 },
];

function AdminDashboard() {
  const [storeDoctorData, setStoreDoctorData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    // Fetch doctors
    axios
      .get(`https://docmeet1.onrender.com/docmeet/user/getDoctorImages`)
      .then((res) => {
        setStoreDoctorData(res.data.data);
      })
      .catch((err) => {
        console.log("Err", err);
      });

    axios
      .get("https://docmeet1.onrender.com/docmeet/user/getAllUsers")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });

    axios
      .get("https://docmeet1.onrender.com/docmeet/admin/getdepartment")
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => {
        console.log("Error fetching departments:", err);
      });
  }, []);
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center lg:text-left">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <div className="bg-white shadow-md p-6 rounded-lg flex items-center gap-4">
            <FaUser className="text-3xl text-blue-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-xl font-semibold text-gray-800">
                {users.length}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg flex items-center gap-4">
            <FaUserMd className="text-3xl text-green-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Doctors</p>
              <p className="text-xl font-semibold text-gray-800">
                {storeDoctorData.length}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg flex items-center gap-4">
            <FaCalendarCheck className="text-3xl text-purple-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Departments</p>
              <p className="text-xl font-semibold text-gray-800">
                {departments.length}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
