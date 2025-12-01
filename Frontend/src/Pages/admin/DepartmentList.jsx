import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        "https://docmeet1.onrender.com/docmeet/admin/getdepartment"
      );
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/EditDepartment/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://docmeet1.onrender.com/docmeet/admin/deletedepartment/${id}`
      );
      fetchDepartments(); // refresh list
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="p-6 w-full">
        <h2 className="text-2xl font-semibold mb-6">Department List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Icon</th>
              <th className="border px-4 py-2">Department Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <div className="w-14 h-14 rounded-full overflow-hidden border shadow-sm bg-white">
                      <img
                        src={`https://docmeet1.onrender.com/uploads1/${dept.image}`}
                        alt={dept.departmentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td className="border px-4 py-2">{dept.departmentName}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(dept._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(dept._id)}
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

export default DepartmentList;
