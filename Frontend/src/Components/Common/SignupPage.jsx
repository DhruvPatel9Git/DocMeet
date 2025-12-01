import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
  let navigate = useNavigate();

  const [signUpData, setsignUpData] = useState({});
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    setsignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const signUpValidation = () => {
    let newErrors = {};

    if (!signUpData.fullname || signUpData.fullname.trim().length < 3) {
      newErrors.fullname = "Full Name must be at least 3 characters";
    }
    if (!signUpData.email || !/^\S+@\S+\.\S+$/.test(signUpData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!signUpData.password || !/^[a-z0-9]{3,30}$/.test(signUpData.password)) {
      newErrors.password =
        "Password must be 3-30 characters and lowercase letters/numbers only";
    }
    return newErrors;
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();

    const newErrors = signUpValidation();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    setLoading(true);
    axios
      .post(`https://docmeet1.onrender.com/docmeet/user/signupOtp`, signUpData)
      .then((res) => {
        console.log("Signup Response:", res.data);
        localStorage.setItem("userEmail", signUpData.email);
        navigate("/user/otp");
        // if (res.data.isSuccess) {
        //     alert('Successfully Registered!');
        //     setsignUpData({});
        //     setError({});
        // } else {
        //     alert('User already exists!');
        // }
      })
      .catch((err) => {
        console.error("Signup Error:", err);
        alert("Signup failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[80vh] flex items-center mt-4">
      <div className="flex flex-col gap-2 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <div>
          <p className="text-2xl font-semibold">SignUp</p>
          <p className="text-sm text-zinc-500">
            Please sign up to book appointment
          </p>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-zinc-700">
            Full Name
          </label>
          <input
            name="fullname"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => {
              handleOnChange(e);
            }}
            value={signUpData.fullname ? signUpData.fullname : ""}
          />
          {errors.fullname ? (
            <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
          ) : (
            ""
          )}
        </div>
        <div className="w-full mt-3">
          <label className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            name="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => {
              handleOnChange(e);
            }}
            value={signUpData.email ? signUpData.email : ""}
          />
          {errors.email ? (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          ) : (
            ""
          )}
        </div>
        <div className="w-full mt-3">
          <label className="block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            name="password"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => {
              handleOnChange(e);
            }}
            value={signUpData.password ? signUpData.password : ""}
          ></input>
          {errors.password ? (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          ) : (
            ""
          )}
        </div>
        <button
          disabled={loading}
          className="bg-[#5D6BFF] text-white w-full py-2 !rounded-lg text-base mt-3 disabled:opacity-60"
          onClick={handleSignUpClick}
        >
          {loading ? "Sending OTP..." : "SignUP"}
        </button>
        <p className="mt-4">
          Already have an account ?{" "}
          <Link to="/user/signin">
            <span className="text-[#5D6BFF] underline cursor-pointer">
              SignIn Here
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
