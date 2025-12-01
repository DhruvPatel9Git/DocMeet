import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion';
import img from "../../assets/images/image.png";
import { Link } from 'react-router-dom';

function Neurologist() {
  const [storeDoctorData, setStoreDoctorData] = useState([])
  useEffect(() => {
    axios.get(`http://localhost:5001/docmeet/user/getNeurologist`)
      .then((res) => {
        console.log(res.data.data)
        setStoreDoctorData(res.data.data)
      })
      .catch((err) => {
        console.log("Err", err)
      })
  }, [])
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8" >
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 max-w-6xl mx-auto mt-6'>
        {

          storeDoctorData.map((val) => {
            const isTodayAvailable = val.doctorAvailableDays.includes(dayName);
            const isAvailable =
              formattedTime > val.doctorTimmings.doctorStart &&
              formattedTime < val.doctorTimmings.doctorEnd && isTodayAvailable;
            return (
              <Link
                key={val._id}
                to={`/user/partDoc/${val._id}`}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className='flex flex-col items-center space-y-2 border p-3 bg-white shadow-lg'
                >
                  <img src={val.doctorImage.imgPath} className='bg-[#5D6BFF]' />
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    ></div>
                    <span
                      className={`font-medium text-sm ${isAvailable ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  <span className='font-bold'>{val.doctorName}</span>
                  <span className='font-semibold'>{val.doctorSpeciality}</span>
                </motion.div>
              </Link>
            )
          })
        }
      </div>

    </div>
  )
}

export default Neurologist