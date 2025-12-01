import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import img1 from  "../../assets/images/doc3.png";
import img from "../../assets/images/image.png"
const Aboutus = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      {/* About Section */}
      <div >

      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          About <span className="text-gray-700 font-medium">Us</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12 px-4 md:px-20">
        <div className="w-full md:max-w-[360px]" data-aos="fade-right">
          <img
            src={img1}
            alt="Doctor"
            className="rounded-xl w-full max-w-md h-auto object-cover"
          />
        </div>

        <div className="space-y-4 text-gray-700 text-base" data-aos="fade-left">
          <p>
            At DocMeet Hospital, we are committed to delivering exceptional medical care with compassion, advanced technology, and a patient-first approach.
          </p>
          <p>
            From preventive care to specialized treatments, we offer a full range of medical services designed to meet the needs of individuals and families across all age groups.
          </p>
          <p>
            We believe that healing begins with trust, and we are honored to be the trusted healthcare partner for thousands of patients and families across Gujarat and beyond.
          </p>

          <h3 className="font-semibold text-xl text-blue-700">Our Vision</h3>
          <p>
            Our vision is to become a leading healthcare provider known for excellence in patient care, medical innovation, and community wellness.
          </p>

          <div className="text-xl my-4">
            <p>Why <span className="text-gray-700 font-semibold">Choose Us?</span></p>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-700 mt-6">
            <div className="border px-10 md:px-8 py-6 flex-1 rounded-lg hover:bg-blue-50 transition-all duration-300">
              <b className="text-blue-700">Efficiency:</b>
              <p className="mt-2">
                We streamline the healthcare process — from scheduling to follow-ups — saving time for both patients and doctors.
              </p>
            </div>

            <div className="border px-10 md:px-8 py-6 flex-1 rounded-lg hover:bg-blue-50 transition-all duration-300">
              <b className="text-blue-700">Convenience:</b>
              <p className="mt-2">
                With 24/7 online access, mobile-friendly design, and real-time notifications, patients can manage appointments anytime.
              </p>
            </div>

            <div className="border px-10 md:px-8 py-6 flex-1 rounded-lg hover:bg-blue-50 transition-all duration-300">
              <b className="text-blue-700">Personalization:</b>
              <p className="mt-2">
                Every patient is unique. Our platform offers tailored recommendations and personal dashboards for better care.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  );
};

export default Aboutus;