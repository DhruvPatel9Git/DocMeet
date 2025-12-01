import axios from "axios";
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Components/Common/AuthContext";

function DoctorSignIn1() {
  const { DoctorSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = React.useState({
    doctorEmail: "",
    doctorPassword: "",
  });
  const [error, setError] = React.useState("");
  //const [adminIsOn,setadminIsOn] = React.useState(false)

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    console.log(adminUser);
    axios
      .post(`https://docmeet1.onrender.com/docmeet/doctor/signin`, adminUser)
      .then((res) => {
        console.log(res.data.tokenDoctor);
        if (res.data.tokenDoctor) {
          DoctorSignIn(res.data.tokenDoctor);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <form
          onSubmit={handleAdminLogin}
          className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-center text-[#5D6BFF] mb-6">
            Doctor SignIn
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="doctorEmail"
              value={adminUser.doctorEmail}
              onChange={(e) =>
                setAdminUser({ ...adminUser, doctorEmail: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D6BFF]"
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="doctorPassword"
              value={adminUser.doctorPassword}
              onChange={(e) =>
                setAdminUser({ ...adminUser, doctorPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D6BFF]"
              placeholder="Enter Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#5D6BFF] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
          <p className="mt-3 text-sm text-center w-full">
            Are you a User?{" "}
            <Link to="/user/signin" className="text-[#5D6BFF] underline">
              User Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default DoctorSignIn1;
