import React from 'react'
import 'aos/dist/aos.css';
import img from "../../assets/images/image.png";

function Footer(){
    return(
        <div>
            <footer className="mt-40 bg-white">
                    <div className="max-w-6xl mx-auto px-4 py-10">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-10">
            
                        {/* Logo & Description */}
                        <div className="flex flex-col space-y-1 max-w-md">
                          <a href="/" className="flex items-center no-underline mb-2" style={{ textDecoration: "none" }}>
                            <img
                              src={img}
                              alt="Logo"
                              className="h-9 w-9 rounded-full mr-3 border-2 border-white"
                            />
                            <h3 className="text-black font-semibold tracking-wider mt-2">
                              D<span className="text-[#5D6BFF]">o</span>cM
                              <span className="text-[#5D6BFF]">ee</span>t
                            </h3>
                          </a>
                          <span className="text-sm text-gray-600 leading-relaxed mt-2 md:pr-4 text-center md:text-left">
                            DocMeet connects patients with certified medical professionals instantly. Book appointments, get consultations, and manage your health – all in one place.
                          </span>
                        </div>
            
                        {/* Company Links */}
                        <div className="flex flex-col space-y-1 items-center md:items-start">
                          <span className="font-bold text-lg">Company</span>
                          <span>Home</span>
                          <span>About</span>
                          <span>Privacy</span>
                        </div>
            
                        {/* Contact Info */}
                        <div className="flex flex-col space-y-1 items-center md:items-start">
                          <span className="font-bold text-lg">GET IN TOUCH</span>
                          <span>+91 79932 29000</span>
                          <span>docmeet@gmail.com</span>
                        </div>
                      </div>
            
                      {/* Bottom Text */}
                      <div className="text-center text-sm text-gray-500 mt-10 pt-4 border-t">
                        © 2025 DocMeet.io – All Rights Reserved.
                      </div>
                    </div>
                  </footer>
        </div>
    )
}

export default Footer