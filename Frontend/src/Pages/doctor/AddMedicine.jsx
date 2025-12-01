import React, { useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

function AddMedicine() {
    const [medicineData, setMedicineData] = useState({
        medicineName: '',
        medicineInfo: ''
    });

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setMedicineData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onHandleSubmit = async () => {
        try {
            const res = await axios.post(`http://localhost:5001/doctor/add-medicine`, medicineData);
            alert('Medicine added successfully');
            setMedicineData({
                medicineName: '',
                medicineInfo: ''
            });
        } catch (err) {
            console.error('Error adding medicine', err);
            alert('Failed to add medicine');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">
            <Sidebar />
            <form className="w-full p-4 md:p-8 flex flex-col">
                <div className="bg-white px-4 md:px-8 py-6 border rounded w-full max-w-3xl mx-auto flex-grow shadow-md">
                    <div className="text-center mb-6">
                        <p className="text-2xl font-semibold text-gray-700">Add Medicine</p>
                    </div>

                    <div className="flex flex-col gap-4 text-gray-600">
                        <InputField
                            label="Medicine Name"
                            name="medicineName"
                            type="text"
                            placeholder="Enter Medicine Name"
                            onChange={onHandleChange}
                            value={medicineData.medicineName}
                        />
                        <TextareaField
                            label="Medicine Info"
                            name="medicineInfo"
                            placeholder="Enter Medicine Info"
                            onChange={onHandleChange}
                            value={medicineData.medicineInfo}
                        />
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            type="button"
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            onClick={onHandleSubmit}
                        >
                            Submit
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

const TextareaField = ({ label, ...props }) => (
    <div>
        <p className="mb-1 font-medium">{label}</p>
        <textarea {...props} rows="4" className="w-full p-2 border rounded" required></textarea>
    </div>
);

export default AddMedicine;
