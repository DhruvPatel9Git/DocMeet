import React, { useState, useEffect, useContext } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Sidebar from './Sidebar';
import axios from 'axios';
import { AuthContext } from '../../Components/Common/AuthContext';
import { useNavigate } from 'react-router-dom';

function AppointmentsPage() {
  const navigate = useNavigate()
  const { getAppointmentDataToday, appointmentsToday, setAppointmentsToday, appointmentsAll, setAppointmentsAll, getAppointmentData } = useContext(AuthContext);
  const doctorToken = localStorage.getItem("doctorToken");
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTimeline, setFilterTimeline] = useState('')
  const [status, setStatus] = useState('All')
  const [filterData, setFilterData] = useState([])
  const [filterData1, setFilterData1] = useState([])
  const [appointmentsPast, setAppointmentsPast] = useState([])
  const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



  useEffect(() => {
    axios.get(`http://localhost:5001/docmeet/doctor/getAppointments`, {
      headers: {
        Authorization: `Bearer ${doctorToken}`
      }
    })
      .then((res) => {
        console.log(res.data.appointments)
        setAppointmentsAll(res.data.appointments)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:5001/docmeet/doctor/getAppointmentstoday`, {
      headers: {
        Authorization: `Bearer ${doctorToken}`
      }
    })
      .then((res) => {
        console.log(res.data.appointments)
        setAppointmentsToday(res.data.appointments)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const addPrescription = async (val) => {
    if(doctorToken){
      const appointmentCompleted = {
        userID: val.userID._id,
        doctorID: val.doctorID._id,
        slotTime: val.slotTime,
        slotDay: val.slotDay,
        slotDate: val.slotDate,
        status: val.status,
        completedAppointment: true
      };

      try {
        const response = await axios.put(
          `http://localhost:5001/docmeet/doctor/completedAppointment`,
          appointmentCompleted, {
          headers: {
            Authorization: `Bearer ${doctorToken}`
          }
        }
        );
        console.log(response.data.msg)
        if(response.data.msg){
            navigate(`/doctor/addprescription/${val.userID.fullname}/${val.userID.email}/${val._id}`)
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Please sign in first');
    }
  }

  const acceptStatus = async (val) => {
    if (doctorToken) {
      const appointmentStatus = {
        userID: val.userID._id,
        doctorID: val.doctorID._id,
        slotTime: val.slotTime,
        slotDay: val.slotDay,
        slotDate: val.slotDate,
        status: 'approved'
      };
      try {
        const response = await axios.put(
          `http://localhost:5001/docmeet/doctor/updatestatuspostive`,
          appointmentStatus, {
          headers: {
            Authorization: `Bearer ${doctorToken}`
          }
        }
        );
        getAppointmentData()
        getAppointmentDataToday()
        console.log(response.data.msg)
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Please sign in first');
    }
  }

  const cancelledStatus = async (val) => {
    console.log("Called")
    if (doctorToken) {
      const appointmentStatus = {
        userID: val.userID._id,
        doctorID: val.doctorID._id,
        slotTime: val.slotTime,
        slotDay: val.slotDay,
        slotDate: val.slotDate,
        status: 'cancelled'
      };
      try {
        const response = await axios.put(
          `http://localhost:5001/docmeet/doctor/updatestatusnegative`,
          appointmentStatus, {
          headers: {
            Authorization: `Bearer ${doctorToken}`
          }
        }
        );
        getAppointmentData()
        getAppointmentDataToday()
        console.log(response.data.msg)
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Please sign in first');
    }
  }
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-6 mt-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-sm w-60"
            value={filterMonth}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setFilterMonth(selectedValue);

              if (selectedValue) {
                axios.get(`http://localhost:5001/docmeet/doctor/filterbymonth/${selectedValue}`, {
                  headers: {
                    Authorization: `Bearer ${doctorToken}`
                  }
                })
                  .then((res) => {
                    setFilterData(res.data.filter)
                    console.log(res.data.filter);
                    setStatus('filterByMonth')
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                setStatus('All')
              }
            }}
          >
            <option value="">Filter by Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-sm w-60"
            value={filterStatus}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setFilterStatus(selectedValue);

              if (selectedValue) {
                axios.get(`http://localhost:5001/docmeet/doctor/filterbystatus/${selectedValue}`, {
                  headers: {
                    Authorization: `Bearer ${doctorToken}`
                  }
                })
                  .then((res) => {
                    setFilterData1(res.data.filter)
                    console.log(res.data.filter);
                    setStatus('filterByStatus')
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                setStatus('All')
              }
            }}
          >
            <option value="">Filter by Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>


          <select
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-sm w-60"
            value={filterTimeline}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setFilterTimeline(selectedValue);

              if (selectedValue === "past") {
                axios.get(`http://localhost:5001/docmeet/doctor/filterbypast`, {
                  headers: {
                    Authorization: `Bearer ${doctorToken}`
                  }
                })
                  .then((res) => {
                    setAppointmentsPast(res.data.aRes)
                    console.log(res.data.aRes);
                    setStatus("Past")
                  })
                  .catch((err) => {
                    console.log(err);
                  });

              } else if (selectedValue === "today") {
                setStatus('Today')
              } else if (selectedValue === "upcoming") {
                setStatus('Upcoming')
              } else {
                setStatus("All")
              }
            }}
          >
            <option value="">Filter by Timeline</option>
            <option value="past">Past</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>


        {
          status === 'All' ?
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-4">Today's Appointments</h1>

              <div className="bg-white shadow rounded-xl overflow-x-auto mt-3">
                <table className="w-full table-auto divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotTime</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotDate</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Start</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {appointmentsToday.map((val, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{val.userID?.fullname}</td>
                        <td className="px-6 py-4">{val.slotTime}</td>
                        <td className="px-6 py-4">{val.slotDate}</td>
                        <td className="px-6 py-4 text-center capitalize font-medium text-gray-700">
                          {val.status}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(()=>{
                                  addPrescription(val)
                            })}
                            disabled={val.status === 'pending'}
                            className={`px-3 py-1 text-sm rounded-md font-medium transition duration-200
                              ${val.status === 'pending'
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'}
                            `}
                          >
                            Add Prescription
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            disabled={val.status !== 'pending'}
                            onClick={(() => { acceptStatus(val) })}
                            className={`mx-1 transition ${val.status === 'approved' || val.status === 'cancelled'
                              ? 'text-green-400 cursor-not-allowed'
                              : 'text-green-600 hover:text-green-800'
                              }`}
                          >
                            <FaCheckCircle size={20} />
                          </button>
                          <button
                            disabled={val.status !== 'pending'}
                            onClick={(() => { cancelledStatus(val) })}
                            className={`mx-1 transition ${val.status === 'cancelled' || val.status === 'approved'
                              ? 'text-red-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800'
                              }`}
                          >
                            <FaTimesCircle size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointmentsAll.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No appointments available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>


              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-5">Upcoming Appointments</h1>

              <div className="bg-white shadow rounded-xl overflow-x-auto mt-3">
                <table className="w-full table-auto divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotTime</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotDate</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Start</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {appointmentsAll.map((val, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{val.userID?.fullname}</td>
                        <td className="px-6 py-4">{val.slotTime}</td>
                        <td className="px-6 py-4">{val.slotDate}</td>
                        <td className="px-6 py-4 text-center capitalize font-medium text-gray-700">
                          {val.status}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(()=>{
                                  addPrescription(val)
                            })}
                            disabled={val.status === 'pending' || val.status === 'cancelled'}
                            className={`px-3 py-1 text-sm rounded-md font-medium transition duration-200
                              ${val.status === 'pending' || val.status === 'cancelled'
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'}
                            `}
                          >
                            Add Prescription
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            disabled={val.status !== 'pending'}
                            onClick={(() => { acceptStatus(val) })}
                            className={`mx-1 transition ${val.status === 'approved' || val.status === 'cancelled'
                              ? 'text-green-400 cursor-not-allowed'
                              : 'text-green-600 hover:text-green-800'
                              }`}
                          >
                            <FaCheckCircle size={20} />
                          </button>
                          <button
                            disabled={val.status !== 'pending'}
                            onClick={(() => { cancelledStatus(val) })}
                            className={`mx-1 transition ${val.status === 'cancelled' || val.status === 'approved'
                              ? 'text-red-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800'
                              }`}
                          >
                            <FaTimesCircle size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointmentsAll.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No appointments available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div> </> : status === 'filterByMonth' ?
              <>
                {filterData && <>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-5">{months[filterData[0]?.monthNum]} Appointments</h1>

                  <div className="bg-white shadow rounded-xl overflow-x-auto mt-3">
                    <table className="w-full table-auto divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotTime</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotDate</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filterData.map((val, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4">{val.userID?.fullname}</td>
                            <td className="px-6 py-4">{val.slotTime}</td>
                            <td className="px-6 py-4">{val.slotDate}</td>
                            <td className="px-6 py-4 text-center capitalize font-medium text-gray-700">
                              {val.status}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                disabled={val.status !== 'pending'}
                                onClick={(() => { acceptStatus(val) })}
                                className={`mx-1 transition ${val.status === 'approved'
                                  ? 'text-green-400 cursor-not-allowed'
                                  : 'text-green-600 hover:text-green-800'
                                  }`}
                              >
                                <FaCheckCircle size={20} />
                              </button>
                              <button
                                disabled={val.status !== 'approved'}
                                onClick={(() => { cancelledStatus(val) })}
                                className={`mx-1 transition ${val.status === 'cancelled'
                                  ? 'text-red-400 cursor-not-allowed'
                                  : 'text-red-600 hover:text-red-800'
                                  }`}
                              >
                                <FaTimesCircle size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {appointmentsAll.length === 0 && (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                              No appointments available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
                }
              </>
              :
              status === "filterByStatus" ?
                <>
                  {filterData1 && <>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-5">{filterData1[0]?.status.charAt(0).toUpperCase() + filterData1[0]?.status.slice(1)} Appointments</h1>

                    <div className="bg-white shadow rounded-xl overflow-x-auto mt-3">
                      <table className="w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotTime</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotDate</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {filterData1.map((val, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4">{val.userID?.fullname}</td>
                              <td className="px-6 py-4">{val.slotTime}</td>
                              <td className="px-6 py-4">{val.slotDate}</td>
                              <td className="px-6 py-4 text-center capitalize font-medium text-gray-700">
                                {val.status}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  disabled={val.status !== 'pending'}
                                  onClick={(() => { acceptStatus(val) })}
                                  className={`mx-1 transition ${val.status === 'approved'
                                    ? 'text-green-400 cursor-not-allowed'
                                    : 'text-green-600 hover:text-green-800'
                                    }`}
                                >
                                  <FaCheckCircle size={20} />
                                </button>
                                <button
                                  disabled={val.status !== 'approved'}
                                  onClick={(() => { cancelledStatus(val) })}
                                  className={`mx-1 transition ${val.status === 'cancelled'
                                    ? 'text-red-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-800'
                                    }`}
                                >
                                  <FaTimesCircle size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {appointmentsAll.length === 0 && (
                            <tr>
                              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                No appointments available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                  }
                </> :
                status === "Past" ?
                  <>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-4">Past Appointments</h1>

                    <div className="bg-white shadow rounded-xl overflow-x-auto mt-3">
                      <table className="w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotTime</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotDate</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {appointmentsPast && appointmentsPast.map((val, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4">{val.userID?.fullname}</td>
                              <td className="px-6 py-4">{val.slotTime}</td>
                              <td className="px-6 py-4">{val.slotDate}</td>
                              <td className="px-6 py-4 text-center capitalize font-medium text-gray-700">
                                {val.status}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  disabled={val.status !== 'pending'}
                                  onClick={(() => { acceptStatus(val) })}
                                  className={`mx-1 transition ${val.status === 'approved'
                                    ? 'text-green-400 cursor-not-allowed'
                                    : 'text-green-600 hover:text-green-800'
                                    }`}
                                >
                                  <FaCheckCircle size={20} />
                                </button>
                                <button
                                  disabled={val.status !== 'approved'}
                                  onClick={(() => { cancelledStatus(val) })}
                                  className={`mx-1 transition ${val.status === 'cancelled'
                                    ? 'text-red-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-800'
                                    }`}
                                >
                                  <FaTimesCircle size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {appointmentsAll.length === 0 && (
                            <tr>
                              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                No appointments available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>


                    </div>
                  </>
                  : status === "Today" ?

                    <>
                      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-4">Today's Appointments</h1>

                      <div className="bg-white shadow rounded-xl overflow-x-auto mt-3">
                        <table className="w-full table-auto divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotTime</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotDate</th>
                              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {appointmentsToday.map((val, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4">{val.userID?.fullname}</td>
                                <td className="px-6 py-4">{val.slotTime}</td>
                                <td className="px-6 py-4">{val.slotDate}</td>
                                <td className="px-6 py-4 text-center capitalize font-medium text-gray-700">
                                  {val.status}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    disabled={val.status !== 'pending'}
                                    onClick={(() => { acceptStatus(val) })}
                                    className={`mx-1 transition ${val.status === 'approved'
                                      ? 'text-green-400 cursor-not-allowed'
                                      : 'text-green-600 hover:text-green-800'
                                      }`}
                                  >
                                    <FaCheckCircle size={20} />
                                  </button>
                                  <button
                                    disabled={val.status !== 'approved'}
                                    onClick={(() => { cancelledStatus(val) })}
                                    className={`mx-1 transition ${val.status === 'cancelled'
                                      ? 'text-red-400 cursor-not-allowed'
                                      : 'text-red-600 hover:text-red-800'
                                      }`}
                                  >
                                    <FaTimesCircle size={20} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {appointmentsAll.length === 0 && (
                              <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                  No appointments available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>


                      </div>
                    </> :
                    status === "Upcoming" ?
                      <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-5">Upcoming Appointments</h1>

                        <div className="bg-white shadow rounded-xl overflow-x-auto mt-3">
                          <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotTime</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SlotDate</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {appointmentsAll.map((val, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4">{val.userID?.fullname}</td>
                                  <td className="px-6 py-4">{val.slotTime}</td>
                                  <td className="px-6 py-4">{val.slotDate}</td>
                                  <td className="px-6 py-4 text-center capitalize font-medium text-gray-700">
                                    {val.status}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      disabled={val.status !== 'pending'}
                                      onClick={(() => { acceptStatus(val) })}
                                      className={`mx-1 transition ${val.status === 'approved'
                                        ? 'text-green-400 cursor-not-allowed'
                                        : 'text-green-600 hover:text-green-800'
                                        }`}
                                    >
                                      <FaCheckCircle size={20} />
                                    </button>
                                    <button
                                      disabled={val.status !== 'approved'}
                                      onClick={(() => { cancelledStatus(val) })}
                                      className={`mx-1 transition ${val.status === 'cancelled'
                                        ? 'text-red-400 cursor-not-allowed'
                                        : 'text-red-600 hover:text-red-800'
                                        }`}
                                    >
                                      <FaTimesCircle size={20} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {appointmentsAll.length === 0 && (
                                <tr>
                                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No appointments available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </> :
                      <h1>No</h1>
        }


      </main>

    </div>
  );
}

export default AppointmentsPage;
