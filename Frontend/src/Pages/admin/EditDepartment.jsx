import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [departmentData, setDepartmentData] = useState({
    departmentName: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // Fetch single department data on mount
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axios.get(
          `https://docmeet1.onrender.com/docmeet/admin/getdepartment/${id}`
        );
        setDepartmentData({
          departmentName: res.data.departmentName,
          image: res.data.image,
        });
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleChange = (e) => {
    setDepartmentData({
      ...departmentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("departmentName", departmentData.departmentName);
    if (imageFile) {
      formData.append("myfile", imageFile); // backend expects 'myfile' key
    }

    try {
      await axios.put(
        `https://docmeet1.onrender.com/docmeet/admin/editdepartment/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate("/admin/departmentlist");
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="p-6 w-full">
        <h2 className="text-2xl font-semibold mb-6">Edit Department</h2>
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow border">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Department Name</label>
            <input
              type="text"
              name="departmentName"
              value={departmentData.departmentName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Current Icon</label>
            {departmentData.image && (
              <img
                src={`https://docmeet1.onrender.com/uploads1/${departmentData.image}`}
                alt="department"
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Update Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDepartment;
