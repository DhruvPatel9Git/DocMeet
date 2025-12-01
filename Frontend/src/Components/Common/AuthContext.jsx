import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    let navigate = useNavigate()
    const token = localStorage.getItem("token");
    const docterToken = localStorage.getItem("docterToken");
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [doctorLoggedIn, setDoctorLoggedIn] = useState(false);
    const [doctorData, setDoctorData] = useState(null)
    const currencySymbol = '₹'
    const doctorToken = localStorage.getItem("doctorToken");
    const [appointmentsAll, setAppointmentsAll] = useState([])
    const [appointmentsToday, setAppointmentsToday] = useState([])

    //this why i created bcz i want to update birthday section that's why i used...
    const getUserData = () => {
      axios.get(`http://localhost:5001/docmeet/user/dashboardName`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
      });
    };

    const getAppointmentData = () => {
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
    };

    const getAppointmentDataToday = () => {
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
    };

    //why this useEffect run bcz after login we set userName but after refresh page token is already
    //in localstorage and with token userLoggedIn becomes true so logout button works good but userName
    //goes null that's why on useEffect we have to reset userData in using setUserData...
    useEffect(() => {
      const token = localStorage.getItem("token");
      const isLoggedIn = localStorage.getItem("token") !== null;
      setUserLoggedIn(isLoggedIn);

      if (token && !userData) {
        axios.get("http://localhost:5001/docmeet/user/dashboardName", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUserData(res.data.user);
          //console.log(res.data.user)
        })
        .catch((err) => {
          console.error("Error fetching user data on load", err);
          logout();
          navigate('/user/signin');
        });
      }
    }, [userData]);

    useEffect(() => {
      const doctorToken = localStorage.getItem("doctorToken");
      const isLoggedIn = localStorage.getItem("doctorToken") !== null;
      setDoctorLoggedIn(isLoggedIn);

      if (doctorToken && !doctorData) {
        axios.get("http://localhost:5001/docmeet/doctor/doctordashboardName", {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        })
        .then((res) => {
          setDoctorData(res.data.doctor);
        })
        .catch((err) => {
          console.error("Error fetching user data on load", err);
          DoctorSignOut()
          setDoctorLoggedIn(false);
          setDoctorData(null);
          navigate('/doctor/signin');
        });
      }
    }, [doctorData]);

    const login = async (token) => {
      localStorage.setItem('token', token)
      setUserLoggedIn(true)
      try {
        const res = await axios.get("http://localhost:5001/docmeet/user/dashboardName", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(res.data.user);
        navigate('/user/dashboard');
      } catch (error) {
        console.error("Failed to fetch user data during login", error);
      }
    };
  
    const logout = () => {
        localStorage.removeItem('userLoggedIn')
        localStorage.removeItem('token')
        setUserLoggedIn(false)
        setUserData(null)
    };

    const DoctorSignIn = async (doctorToken) => {
      localStorage.setItem('doctorToken', doctorToken)
      setDoctorLoggedIn(true)
      try {
        const res = await axios.get("http://localhost:5001/docmeet/doctor/doctordashboardName", {
          headers: {
            Authorization: `Bearer ${doctorToken}`
          }
        });
        setDoctorData(res.data.doctor);
        navigate('/doctor/dashboard');
      } catch (error) {
        console.error("Failed to fetch user data during login", error);
      }
    }
  
    const DoctorSignOut = () => {
      localStorage.removeItem('doctorToken')
      setDoctorLoggedIn(false);
      setDoctorData(null);
  };
    return (
      <AuthContext.Provider value={{getAppointmentDataToday ,appointmentsToday,setAppointmentsToday,appointmentsAll,setAppointmentsAll,getAppointmentData,docterToken,DoctorSignOut,DoctorSignIn,doctorLoggedIn,doctorData,userLoggedIn, setUserLoggedIn, logout ,login,userData,setUserData,token,getUserData,currencySymbol}}>
        {children}
      </AuthContext.Provider>
    );
  };