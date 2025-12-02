import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import verfied from "../../assets/images/verfied.png";
import info from "../../assets/images/information.png";
import { AuthContext } from "../../Components/Common/AuthContext";
import { months } from "moment/moment";

function PartDoc() {
  const { currencySymbol, token, userData } = useContext(AuthContext);
  const { _id } = useParams();
  const [storeDoctorData, setStoreDoctorData] = useState(null);
  const [storeUserData, setStoreUserData] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);
  const [totalDays, setTotalDays] = useState([]);
  const [time, setTime] = useState([]);
  const [selectedFullDay, setSelectedFullDay] = useState(null);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [disableSlot, setDisableSlot] = useState(null);

  useEffect(() => {
    axios
      .get(`https://docmeet1.onrender.com/docmeet/user/appointmentShowForHide`)
      .then((res) => {
        setAppointmentData(res.data.appointments || []);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setStoreUserData(userData);
  }, [userData]);

  useEffect(() => {
    axios
      .get(`https://docmeet1.onrender.com/docmeet/user/partDoc/${_id}`)
      .then((res) => setStoreDoctorData(res.data.data))
      .catch((err) => console.log(err));
  }, [_id]);

  useEffect(() => {
    if (
      storeDoctorData?.doctorTimmings &&
      storeDoctorData?.slotDuration &&
      selectedDate &&
      appointmentData &&
      selectedFullDay
    ) {
      const slots = [];
      const [startHour, startMin] = storeDoctorData.doctorTimmings.doctorStart
        .split(":")
        .map(Number);
      const [endHour, endMin] = storeDoctorData.doctorTimmings.doctorEnd
        .split(":")
        .map(Number);

      const today = new Date();
      const slotDate = new Date();
      const [dayName, datePart] = selectedFullDay.split(" - ");
      const [dateNum, month] = datePart.split(" ");
      slotDate.setDate(parseInt(dateNum));

      const start = new Date(slotDate);
      start.setHours(startHour, startMin, 0, 0);

      const end = new Date(slotDate);
      end.setHours(endHour, endMin, 0, 0);

      if (end <= start) end.setDate(end.getDate() + 1);

      const now = new Date();
      now.setSeconds(0, 0);
      now.setMilliseconds(0);

      const current = new Date(start);
      while (current <= end) {
        const isToday =
          current.getDate() === today.getDate() &&
          current.getMonth() === today.getMonth() &&
          current.getFullYear() === today.getFullYear();

        if ((isToday && current >= now) || !isToday) {
          const timeStr = current
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .trim();
          slots.push(timeStr);
        }
        current.setMinutes(current.getMinutes() + storeDoctorData.slotDuration);
      }

      console.log("Generated slots:", slots);
      console.log("Doctor ID:", storeDoctorData._id);

      const formattedSlotDate = `${dateNum} ${month}`;
      console.log("Formatted slot date:", formattedSlotDate);

      console.log(storeDoctorData);

      const bookedSlots = appointmentData
        .filter((val) => {
          return (
            val.status === "approved" &&
            val.slotDate === formattedSlotDate &&
            val.doctorID?._id &&
            storeDoctorData?._id &&
            val.doctorID?._id === storeDoctorData?._id
          );
        })
        .map((val) => val.slotTime);

      console.log("Booked Slots:", bookedSlots);

      const bookedSlots1 = appointmentData
        .filter((val) => {
          return (
            val.status === "pending" &&
            val.slotDate === formattedSlotDate &&
            val.doctorID?._id &&
            storeDoctorData?._id &&
            val.doctorID?._id === storeDoctorData?._id
          );
        })
        .map((val) => val.slotTime);

      console.log("Booked Slots1:", bookedSlots1);
      setDisableSlot(bookedSlots1);

      const availableSlots = slots.filter(
        (time) => !bookedSlots.includes(time)
      );
      console.log("Available slots after filtering:", availableSlots);
      setTime(availableSlots);
    }
  }, [storeDoctorData, selectedDate, selectedFullDay, appointmentData]);

  useEffect(() => {
    if (storeDoctorData?.doctorAvailableDays) {
      const today = new Date();
      const nextAvailableDays = [];

      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const dayName = daysOfWeek[date.getDay()];
        if (storeDoctorData.doctorAvailableDays.includes(dayName)) {
          const formattedDate = `${dayName} - ${date.getDate()} ${date.toLocaleString(
            "default",
            { month: "short" }
          )}`;
          nextAvailableDays.push(formattedDate);
        }
      }
      setTotalDays(nextAvailableDays);
    }
  }, [storeDoctorData]);

  const handleOnClick = async () => {
    if (token) {
      const months = [
        {
          1: "jan",
          2: "Feb",
          3: "Mar",
          4: "April",
          5: "May",
          6: "Jun",
          7: "Jul",
          8: "Aug",
          9: "Sept",
          10: "Oct",
          11: "Nov",
          12: "Dec",
        },
      ];
      console.log(selectedDate);
      const monthNumArray = months.map((val, index) => {
        for (const key in val) {
          if (val[key] == selectedDate.split(" ")[1]) {
            return key;
          }
        }
      });

      const monthNum = Number(monthNumArray.find(Boolean));

      const appointmentData = {
        userID: storeUserData._id,
        doctorID: storeDoctorData._id,
        slotTime: selectedTime,
        slotDate: selectedDate,
        slotDay: selectedDay,
        monthNum: monthNum,
      };
      console.log(appointmentData);
      try {
        const response = await axios.patch(
          `https://docmeet1.onrender.com/docmeet/user/appintmentBooking`,
          appointmentData
        );
        setDisableSlot((prev) => [...prev, selectedTime]);
        setSelectedTime(null);
        setSelectedFullDay(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        console.log(response);
        if (
          storeDoctorData?.doctorTimmings &&
          storeDoctorData?.slotDuration &&
          selectedDate &&
          appointmentData &&
          selectedFullDay
        ) {
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please sign in first");
    }
  };

  return (
    <div>
      {storeDoctorData ? (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <img
                className="bg-[#5D6BFF] w-full sm:max-w-65 rounded-xl shadow-lg border border-white/30"
                src={storeDoctorData.doctorImage?.imgPath || "/img2.png"}
                alt={storeDoctorData.doctorName || "Doctor"}
              />
            </div>

            <div className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl p-8 py-7 mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
              <p className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                {storeDoctorData.doctorName}{" "}
                <img src={verfied} alt="Verified" className="w-5 h-5" />
              </p>

              <div className="flex items-center gap-2 text-sm mt-1 text-gray-700">
                <p>
                  {storeDoctorData.doctorDegree} -{" "}
                  {storeDoctorData.doctorSpeciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full mb-3">
                  {storeDoctorData.doctorExperience} Years
                </button>
              </div>

              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                  About
                  <img
                    src={info}
                    alt="Info"
                    className="w-3.5 h-3.5 cursor-pointer hover:scale-110 transition-transform duration-200"
                  />
                </p>
                <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                  {storeDoctorData.doctorDesc}
                </p>
              </div>

              <p className="text-sm text-gray-600 max-w-[700px] mt-3">
                Appointment Fees :{" "}
                <span className="text-gray-600 font-bold">
                  {currencySymbol}
                  {storeDoctorData.doctorFees}
                </span>
              </p>
            </div>
          </div>

          <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700">
            <p className="text-lg mb-3">Available Days</p>
            <div className="flex gap-3 flex-wrap overflow-x-scroll p-2">
              {totalDays.map((day, index) => (
                <span
                  key={index}
                  onClick={() => {
                    const [day1, datePart] = day.split(" - ");
                    const [dateNum, month] = datePart.split(" ");
                    setSelectedDay(day1);
                    setSelectedDate(`${dateNum} ${month}`);
                    setSelectedFullDay(day);
                  }}
                  className={`px-4 py-2 rounded-full text-sm shadow-sm cursor-pointer transition-all 
                    ${
                      selectedFullDay === day
                        ? "bg-[#3b4ae0] text-white scale-105"
                        : "bg-gradient-to-br from-[#e0e7ff] to-[#f0f4ff] shadow-xl text-black"
                    }`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700 ">
            <div className="flex gap-3 flex-wrap p-2">
              {time.length > 0 ? (
                time.map((val, index) => {
                  const isDisabled = disableSlot.includes(val);

                  return (
                    <span
                      key={index}
                      onClick={() => {
                        if (!isDisabled) setSelectedTime(val);
                      }}
                      className={`px-4 py-2 rounded-full text-sm shadow-sm cursor-pointer transition-all 
                      ${
                        selectedTime === val
                          ? "bg-[#3b4ae0] text-white scale-105"
                          : isDisabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-br from-[#e0e7ff] to-[#f0f4ff] shadow-xl text-black"
                      }`}
                    >
                      {val}
                    </span>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">
                  No available slots listed
                </p>
              )}
            </div>

            <div className="mt-6 p-2">
              <button
                onClick={handleOnClick}
                className="bg-[#5D6BFF] hover:bg-[#4a5ce3] text-white font-medium px-6 py-2 rounded-lg shadow transition duration-200"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mt-10 text-gray-600">
          Loading doctor details...
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-all">
          ✅ Appointment booked successfully!
        </div>
      )}
    </div>
  );
}

export default PartDoc;
