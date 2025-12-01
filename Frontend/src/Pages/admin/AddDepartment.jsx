import React, { useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddDepartment() {
  const [departmentData, setDepartmentData] = useState({
    departmentName: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDepartmentData({
      ...departmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreviewUrl(imageURL);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!departmentData.departmentName || !imageFile) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append('departmentName', departmentData.departmentName);
    formData.append('myfile', imageFile); // Key must match backend (already correct)

    try {
      const res = await axios.post('http://localhost:5001/docmeet/admin/adddepartment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Department added:', res.data);
      setDepartmentData({ departmentName: '' });
      setImageFile(null);
      setPreviewUrl(null);
      navigate('/admin/departmentlist');
    } catch (err) {
      console.error('Error adding department:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <Sidebar />
      <form className="w-full p-4 md:p-8 flex flex-col">
        <div className="bg-white px-4 md:px-8 py-6 border rounded w-full max-w-4xl mx-auto shadow-md">
          <div className="text-center mb-6">
            <p className="text-2xl font-semibold text-gray-700">Add Department</p>
          </div>

          <div className="space-y-6 text-gray-700">
            <InputField
              label="Department Name"
              name="departmentName"
              type="text"
              placeholder="e.g., Neurologist"
              value={departmentData.departmentName}
              onChange={handleChange}
            />

            <div>
              <p className="mb-1 font-medium">Upload Department Icon</p>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded"
                onChange={handleImageChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-full border"
                />
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleSubmit}
            >
              Add Department
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const InputField = ({ label, ...props }) => (
  <div>
    <p className="mb-1 font-medium">{label}</p>
    <input {...props} className="w-full p-2 border rounded" required />
  </div>
);

export default AddDepartment;
