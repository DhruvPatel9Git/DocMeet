import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img from "../../assets/images/image.png";

import {
  FaTachometerAlt,
  FaUserMd,
  FaListUl,
  FaUser,
  FaUserNurse,
  FaSignOutAlt
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

function Sidebar() {
  let navigate = useNavigate()
  return (
    <div>
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-6">


        <a href="/" className="flex items-center no-underline" style={{ textDecoration: "none" }}>
          <img
            src={img}
            alt="Logo"
            className="h-12 w-12 rounded-full mr-3 border-2 border-white mb-2"
          />
          <h3 className="text-black font-semibold tracking-wider">
            D<span className="text-[#5D6BFF]">o</span>cM
            <span className="text-[#5D6BFF]">ee</span>t
          </h3>
        </a>
        <nav className="flex flex-col space-y-5 mt-4">
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition no-underline" style={{ textDecoration: "none" }}>
            <FaTachometerAlt /> Dashboard
          </Link>

          <Link to="/admin/adddoctor" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition no-underline" style={{ textDecoration: "none" }}>
          <FaUserMd /> Add Doctor
          </Link>

          <Link to="/admin/addnurse" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition no-underline" style={{ textDecoration: "none" }}>
          <FaUserNurse/>Add Nurse
          </Link>

          <Link to="/admin/doctorlist" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition no-underline" style={{ textDecoration: "none" }}>
            <FaListUl /> Doctor List
          </Link>
            <Link to="/admin/adddepartment" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition no-underline" style={{ textDecoration: "none" }}>
            <FaListUl /> Add Department
          </Link>
             <Link to="/admin/departmentlist" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition no-underline" style={{ textDecoration: "none" }}>
            <FaListUl /> Department List
          </Link>
          <Link to='/admin/signin' className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition no-underline" style={{ textDecoration: "none" }}>
            <FaSignOutAlt /> Log Out
          </Link>
        </nav>

      </aside>
    </div>
  )
}
export default Sidebar;