import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate,useParams } from 'react-router-dom';

function AddPrescription() {
    const navigate = useNavigate();
    const params = useParams();
    const fullname = params.fullname || '';
    const email = params.email || '';
    const _id = params._id || null;
    const doctorToken = localStorage.getItem("doctorToken");

    useEffect(()=>{
        if(_id){
            axios.get(`http://localhost:5001/docmeet/doctor/getDataAppointment/${_id}`,{headers: {
                Authorization: `Bearer ${doctorToken}`
            }})
            .then((res) => {
                console.log(res.data.filterData)
                
            })
            .catch((err) => {
                console.log(err)
            })
        }
    },[_id, doctorToken])
    
    const [prescriptionData, setPrescriptionData] = useState({
        patientName: fullname,
        patientEmail: email,
        additionalInfo: '',
    });

    const [imageStore, setImageStore] = useState(null);

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setPrescriptionData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageStore(file);
        }
    };

    const onHandleSubmit = async () => {
        const formData = new FormData();

         for (const key in prescriptionData) {
            formData.append(key, prescriptionData[key]);
        }
    
        formData.append("prescriptionImage",imageStore);

        console.log(formData)
        try {
            await axios.post(`http://localhost:5001/docmeet/doctor/addPrescription`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPrescriptionData({
                patientName: '',
                patientEmail: '',
                additionalInfo: '',
                img: '',
            });
            setImageStore(null);
        } catch (err) {
            console.error('Error adding prescription', err);
            alert('Failed to add prescription');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">
            <Sidebar />
            <form className="w-full p-4 md:p-8 flex flex-col">
                <div className="bg-white px-4 md:px-8 py-6 border rounded w-full max-w-4xl mx-auto flex-grow shadow-md">
                    <div className="text-center mb-6">
                        <p className="text-2xl font-semibold text-gray-700">Add Prescription</p>
                    </div>

                    <div className="flex flex-col gap-4 text-gray-600">
                        <InputField
                            label="Patient Name"
                            name="patientName"
                            type="text"
                            placeholder="Enter Patient Name"
                            onChange={((e) => {
                                onHandleChange(e)
                            })}
                            value={prescriptionData.patientName ? prescriptionData.patientName : fullname}
                        />
                        <InputField
                            label="Patient Email"
                            name="patientEmail"
                            type="email"
                            placeholder="Enter Patient Email"
                            onChange={((e) => {
                                onHandleChange(e)
                            })}
                            value={prescriptionData.patientEmail ? prescriptionData.patientEmail : email} />
                        <TextareaField
                            label="Additional Info"
                            name="additionalInfo"
                            placeholder="Enter Additional Info"
                            onChange={((e) => {
                                onHandleChange(e)
                            })}
                            value={prescriptionData.additionalInfo ? prescriptionData.additionalInfo : ' '} />
                        <div>
                            <p className="mb-1 font-medium">Prescription Photo</p>
                            <input
                                type="file"
                                name="prescriptionPhoto"
                                accept="image/*"
                                className="w-full p-2 border rounded"
                                onChange={((e) => {
                                    onFileChange(e)
                                })}
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            type="button"
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            onClick={(() => {
                                onHandleSubmit()
                            })}
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

export default AddPrescription;
