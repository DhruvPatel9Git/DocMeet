import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function EditDoctor() {
    const [doctorData, setDoctorData] = useState({
        doctorStart: '',
        doctorEnd: '',
    });
    const [availableDays, setAvailableDays] = useState([]);
    const [imageStore, setImageStore] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
    const fetchDoctor = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/docmeet/admin/getDoctor/${id}`);
            const data = res.data?.data || res.data;  // fix if wrapped in 'data'
            console.log(data)
            const timings = data.doctorTimmings || { doctorStart: '', doctorEnd: '' };
            const available = Array.isArray(data.doctorAvailableDays) ? data.doctorAvailableDays : [];

            setDoctorData({
                ...data,
                doctorStart: timings.doctorStart || '',
                doctorEnd: timings.doctorEnd || '',
                doctorImage: data?.doctorImage?.imgPath || ''
            });

            setAvailableDays(available);
        } catch (err) {
            console.error('Error fetching doctor:', err);
        }
    };

    if (id) fetchDoctor();
}, [id]);

    const onHandleChange = (e) => {
        setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
    };

    const onHandleClick = async () => {
        const formData = new FormData();

        // Append fields
        Object.keys(doctorData).forEach((key) => {
            if (!['doctorStart', 'doctorEnd', 'doctorImage'].includes(key)) {
                formData.append(key, doctorData[key]);
            }
        });

        formData.append('doctorTimmings', JSON.stringify({
            doctorStart: doctorData.doctorStart,
            doctorEnd: doctorData.doctorEnd,
        }));

        formData.append('doctorAvailableDays', JSON.stringify(availableDays));

        if (imageStore) {
            formData.append('myfile', imageStore);
        }

        try {
            const res = await axios.put(
                `http://localhost:5001/docmeet/admin/updateDoctor/${doctorData._id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log('Doctor updated', res.data);
            navigate('/admin/doctorlist');
        } catch (err) {
            console.error('Error updating doctor', err);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">
            <Sidebar />
            <form className="w-full p-4 md:p-8 flex flex-col">
                <div className="bg-white px-4 md:px-8 py-6 border rounded w-full max-w-6xl mx-auto flex-grow shadow-md">
                    <div className="text-center mb-6">
                        <p className="text-2xl font-semibold text-gray-700">Edit Doctor</p>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8 text-gray-600">
                        <div className="flex-1 space-y-4">
                            <InputField label="Doctor Name" name="doctorName" value={doctorData.doctorName || ''} onChange={onHandleChange} required />
                            <InputField label="Doctor Email" name="doctorEmail" value={doctorData.doctorEmail || ''} onChange={onHandleChange} required />
                            <InputField label="Doctor Password" name="doctorPassword" type="password" value={doctorData.doctorPassword || ''} onChange={onHandleChange} required />
                            <InputField label="Doctor Experience" name="doctorExperience" value={doctorData.doctorExperience || ''} onChange={onHandleChange} required />
                            <InputField label="Doctor Degree" name="doctorDegree" value={doctorData.doctorDegree || ''} onChange={onHandleChange} required />
                            <TextareaField label="Doctor Address" name="doctorAddress" value={doctorData.doctorAddress || ''} onChange={onHandleChange} required />
                            <div>
                                <p className="mb-1 font-medium">Doctor Speciality</p>
                                <select name="doctorSpeciality" value={doctorData.doctorSpeciality || ''} onChange={onHandleChange} className="w-full p-2 border rounded" required>
                                    <option value="">Select Speciality</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatricians">Pediatricians</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Gastroenterologist">Gastroenterologist</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <InputField label="Slot Duration" name="slotDuration" value={doctorData.slotDuration || ''} onChange={onHandleChange} required />
                            <InputField label="Doctor Fees" name="doctorFees" value={doctorData.doctorFees || ''} onChange={onHandleChange} required />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <p className="mb-1 font-medium">Start Time</p>
                                    <input type="time" name="doctorStart" value={doctorData.doctorStart} onChange={onHandleChange} className="w-full p-2 border rounded" required />
                                </div>
                                <div className="flex-1">
                                    <p className="mb-1 font-medium">End Time</p>
                                    <input type="time" name="doctorEnd" value={doctorData.doctorEnd} onChange={onHandleChange} className="w-full p-2 border rounded" required />
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 font-medium">Available Days</p>
                                <div className="flex flex-wrap gap-4">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                        <label key={day} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={availableDays.includes(day)}
                                                onChange={(e) => {
                                                    const { checked, value } = e.target;
                                                    setAvailableDays((prev) =>
                                                        checked ? [...prev, value] : prev.filter((d) => d !== value)
                                                    );
                                                }}
                                                className="form-checkbox text-blue-600"
                                            />
                                            <span className="text-gray-700">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <InputField label="Phone Number" name="doctorPhno" value={doctorData.doctorPhno || ''} onChange={onHandleChange} required />
                            <InputField label="Rating" name="doctorRating" type="number" step="0.1" value={doctorData.doctorRating || ''} onChange={onHandleChange} required />
                            <div>
                                <p className="mb-1 font-medium">Doctor Image</p>
                                <input type="file" className="w-full p-2 border rounded" onChange={(e) => setImageStore(e.target.files[0])} />
                                {doctorData.doctorImage && !imageStore && (
                                    <img src={doctorData.doctorImage} alt="Doctor" className="mt-2 w-24 h-24 object-cover border rounded" />
                                )}
                            </div>
                            <TextareaField label="Description" name="doctorDesc" value={doctorData.doctorDesc || ''} onChange={onHandleChange} required />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={onHandleClick}>
                            {doctorData._id ? 'Update Doctor' : 'Add Doctor'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

const InputField = ({ label, required = false, ...props }) => (
    <div>
        <p className="mb-1 font-medium">{label}</p>
        <input {...props} required={required} className="w-full p-2 border rounded" />
    </div>
);

const TextareaField = ({ label, required = false, ...props }) => (
    <div>
        <p className="mb-1 font-medium">{label}</p>
        <textarea {...props} rows="4" required={required} className="w-full p-2 border rounded" />
    </div>
);

export default EditDoctor;