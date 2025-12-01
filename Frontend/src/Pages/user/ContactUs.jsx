import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import img from "../../assets/images/img2.png";


const ContactUs = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <>
            <div>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                        {/* Doctor Image */}
                        <div className="w-full md:max-w-[360px]" data-aos="fade-right">
                            <img
                                src={img}
                                alt="Doctor"
                                className="rounded-xl w-full max-w-md h-auto object-cover"
                            />
                        </div>

                        {/* Contact Info */}
                        <div data-aos="fade-left">
                            <h2 className="text-4xl font-bold text-blue-700 mb-6">Contact Us</h2>
                            <p className="text-gray-700 text-lg mb-4">
                                We’re here to help you. Whether you have questions about appointments, services, or emergencies — feel free to reach out anytime.
                            </p>

                            <div className="space-y-4 mt-6">
                                <div className="flex items-start gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/484/484167.png" alt="Phone" className="w-6 h-6 mt-1" />
                                    <p className="text-gray-800 text-base">
                                        <strong>Phone:</strong> +91 98765 43210
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" className="w-6 h-6 mt-1" />
                                    <p className="text-gray-800 text-base">
                                        <strong>Email:</strong> support@hospitalcare.com
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Address" className="w-6 h-6 mt-1" />
                                    <p className="text-gray-800 text-base">
                                        <strong>Address:</strong> 123 Health Street, MedCity, Gujarat, India
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png" alt="Hours" className="w-6 h-6 mt-1" />
                                    <p className="text-gray-800 text-base">
                                        <strong>Working Hours:</strong> Mon–Sat: 9 AM – 8 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
};

export default ContactUs;