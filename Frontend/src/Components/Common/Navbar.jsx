import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/images/img2.png";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../Common/AuthContext';
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from 'lucide-react';


function Navbar() {
  const { userLoggedIn, logout ,userData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  let navigate = useNavigate()
  
  return (
    <>
      <nav className="bg-gray-100 shadow-lg py-1.5 px-5 font-['Poppins']">
        <div className="container mx-auto flex items-center justify-between relative">
          <a href="/" className="flex items-center no-underline" style={{ textDecoration: "none" }}>
            <img
              src={img}
              alt="Logo"
              className="h-12 w-12 rounded-full mr-3 border-2 border-[#5D6BFF] mb-2"
            />
            <h3 className="text-black font-semibold tracking-wider">
              D<span className="text-[#5D6BFF]">o</span>cM
              <span className="text-[#5D6BFF]">ee</span>t
            </h3>
          </a>

          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
            {userLoggedIn ?
              <>
                <Link to="/user/dashboard" className="text-gray-800 hover:text-[#5D6BFF] font-semibold" style={{ textDecoration: "none" }}>HOME</Link>
                <Link to="/user/alldoctors" className="text-gray-800 hover:text-[#5D6BFF] font-semibold" style={{ textDecoration: "none" }}>ALL DOCTORS</Link>
                <Link to="/user/allappointments" className="text-gray-800 hover:text-[#5D6BFF] font-semibold" style={{ textDecoration: "none" }}>APPOINTMENTS</Link>
                <Link to="/user/Aboutus" className="text-gray-800 hover:text-[#5D6BFF] font-semibold" style={{ textDecoration: "none" }}>ABOUT</Link>
                <Link to="/user/ContactUs" className="text-gray-800 hover:text-[#5D6BFF] font-semibold" style={{ textDecoration: "none" }}>CONTACT</Link>
              </> : ' '
            }
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {
              userLoggedIn ?
                <>
                  <img
                    src={userData?.picture || '/default-user.png'}
                    alt="User"
                    className="h-10 w-10 rounded-full object-cover border-2 border-[#5D6BFF] cursor-pointer"
                    onClick={() => setShowModal(true)}
                  />
                  <AnimatePresence>
                    {showModal && (
                      <>
                        <motion.div
                          className="fixed inset-0 bg-black bg-opacity-50 z-40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowModal(false)}
                        />
                        <motion.div
                          className="fixed z-50 top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-6 text-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-3 text-white-500 hover:text-red-500 text-lg"
                          >
                            ✕
                          </button>
                          <img
                            src={userData?.picture || img}
                            alt="User"
                            className="w-20 h-20 rounded-full border-2 border-[#5D6BFF] mx-auto mb-4"
                          />
                          <h2 className="text-xl font-bold">{userData?.fullname || "User Name"}</h2>
                          <p className="text-black-600 font-semibold">{userData?.email || "user@example.com"}</p>

                          <div className="w-full text-left space-y-2">
                              <button
                                onClick={() => {
                                  navigate('/user/Editprofile')
                                  setShowModal(false)
                                }}
                                className="bg-[#5D6BFF] mt-6 text-white mx-auto px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:bg-[#4a5de4] transition-all duration-200 block"
                              >
                                ✏️ Edit Information
                              </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                  <Link to="/user/signin">
                    <button
                      onClick={logout}
                      className="bg-[#5D6BFF] text-white px-2 py-2 !rounded-xl text-sm font-medium shadow-md hover:bg-[#4a5de4] transition-all duration-200 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </Link>
                </>
                :
                <>
                  <button
                    onClick={() => window.location.href = '/user/signup'}
                    className="bg-[#5D6BFF] text-white px-3 py-1 rounded-xl text-xs hover:bg-blue-700 shadow-md"
                  >
                    SignUp
                  </button>
                  <button
                    onClick={() => window.location.href = '/user/signin'}
                    className="bg-gray-300 text-black px-3 py-1 rounded-xl text-xs hover:bg-[#5D6BFF] hover:text-white shadow-md"
                  >
                    SignIn
                  </button>
                </>
            }

          </div>

          <div className="md:hidden">
            <button className="p-2" onClick={() => setIsOpen(true)}>
              <FontAwesomeIcon icon={faBars} className="text-gray-800 text-2xl" />
            </button>
          </div>

          {isOpen && (
            <div className="fixed bg-white inset-0 z-50 p-5">
              <div className="flex justify-between items-center mb-8">
                <a href="/" className="flex items-center no-underline" style={{ textDecoration: "none" }}>
                  <img src={img} alt="Logo" className="h-12 w-12 rounded-full mr-3 border-2 border-white mb-2" />
                  <h3 className="text-black font-semibold tracking-wider">
                    D<span className="text-[#5D6BFF]">o</span>cM
                    <span className="text-[#5D6BFF]">ee</span>t
                  </h3>
                </a>
                <button className="p-2" onClick={() => setIsOpen(false)}>
                  <FontAwesomeIcon icon={faTimes} className="text-gray-800 text-2xl" />
                </button>
              </div>
              <div className="flex flex-col space-y-6">
                <a href="/features" className="text-gray-800 font-semibold hover:text-[#5D6BFF]" style={{ textDecoration: "none" }}>HOME</a>
                <a href="/AllDoctors" className="text-gray-800 font-semibold hover:text-[#5D6BFF]" style={{ textDecoration: "none" }}>ALL DOCTORS</a>
                <a href="/about" className="text-gray-800 font-semibold hover:text-[#5D6BFF]" style={{ textDecoration: "none" }}>ABOUT</a>
                <Link to="/contact" className="text-gray-800 font-semibold hover:text-[#5D6BFF]" style={{ textDecoration: "none" }}>CONTACT</Link>
                {userLoggedIn ? (
                  <>
                    <Link to="/user/signin">
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="bg-gray-300 text-black px-3 py-2 rounded-lg text-sm hover:bg-red-500 hover:text-white"
                      >
                        Logout
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/user/signup">
                      <button className="bg-[#5D6BFF] text-white px-3 py-2 rounded-lg text-sm">
                        Sign Up
                      </button>
                    </Link>
                    <Link to="/user/signin">
                      <button className="bg-gray-300 text-black px-3 py-2 rounded-lg text-sm hover:bg-[#5D6BFF] hover:text-white">
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </div>

            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
