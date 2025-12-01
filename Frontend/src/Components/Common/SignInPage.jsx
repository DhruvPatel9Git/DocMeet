import axios from 'axios'
import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../Common/AuthContext';
import { auth, provider, signInWithPopup } from "../../firebase";

function SignInPage() {
    let navigate = useNavigate()
    const { userLoggedIn, setUserLoggedIn, logout, login } = useContext(AuthContext);
    const [signInData, setsignInData] = useState({})
    const [errors, setErrors] = useState({});


    const handleOnChange = (e) => {
        setsignInData({
            ...signInData,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = () => {
        const newErrors = {};

        if (!signInData.email) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(signInData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!signInData.password) {
            newErrors.password = "Password is required";
        } else if (signInData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGoogleSignIn = async () => {
        try {
            //console.log("Clicked Google Sign-In");
            const result = await signInWithPopup(auth, provider);
            //console.log("Google result", result);
            const token = await result.user.getIdToken();
            //console.log("Google token", token);

            const res = await axios.post("http://localhost:5001/docmeet/user/googlesignin", { token });
            //console.log("Backend response", res.data);
            if (res.data.token) {
                login(res.data.token);
                navigate('/user/dashboard');
            } else {
                alert("Login failed. " + (res.data.msg || "No token returned from backend."));
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            if (error.code === 'auth/popup-blocked') {
                alert("Pop-up was blocked. Please allow pop-ups for this site and try again.");
            } else if (error.code === 'auth/popup-closed-by-user') {
                alert("Sign-in was cancelled.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                alert("Sign-in request was cancelled.");
            } else if (error.response?.data?.msg) {
                alert("Login failed: " + error.response.data.msg);
            } else {
                alert("Google Sign-In Error: " + (error.message || "Unknown error occurred"));
            }
        }
    };



    const handleSignInClick = () => {
        if (!validateForm()) return;
        console.log(signInData)
        axios.post(`http://localhost:5001/docmeet/user/signin`, signInData)
            .then((res) => {
                console.log("Successfully Added")
                console.log(signInData)
                if (res.data.token) {
                    login(res.data.token)
                }
            })
            .catch((err) => {
                console.log("Not Successfully Added", err)
            })
        //setsignInData({})
    }
    return (
        <div className='min-h-[80vh] flex items-center '>
            <div className='bg-white/20 backdrop-blur-md border-white/30 flex flex-col gap-2 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <div>
                    <p className='text-2xl font-semibold'>SignIn</p>
                    <p className='text-sm text-zinc-500'>Please sign in to book appointment</p>
                </div>

                <div className='w-full mt-3'>
                    <label className='block text-sm font-medium text-zinc-700'>Email</label>
                    <input
                        name='email'
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type='email'
                        onChange={((e) => { handleOnChange(e) })}
                        value={signInData.email ? signInData.email : ''}
                    />
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>
                <div className='w-full mt-3'>
                    <label className='block text-sm font-medium text-zinc-700'>Password</label>
                    <input
                        name='password'
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type='password'
                        onChange={((e) => { handleOnChange(e) })}
                        value={signInData.password ? signInData.password : ''}
                    >
                    </input>
                    {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
                </div>

                <div className="w-full text-right mt-1">
                    <Link to="/user/forgot-password" className="text-[#5D6BFF] text-sm underline">
                        Forgot Password?
                    </Link>
                </div>

                <button onClick={(() => { handleSignInClick() })}
                    className='bg-[#5D6BFF] text-white w-full py-2 !rounded-lg text-base mt-3'>SignIn
                </button>
                <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-3 w-full px-4 py-2 mt-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google logo"
                        className="w-5 h-5"
                    />
                    <span className="font-medium">Sign in with Google</span>
                </button>

                <p className='mt-3 text-center w-full'>Don't have an account? <Link to="/user/signup"><span className='text-[#5D6BFF] underline cursor-pointer'>SignUp Here</span></Link></p>
                <p className='text-sm text-center w-full'>
                    Are you a doctor?{" "}
                    <Link to="/doctor/signin" className="text-[#5D6BFF] underline">
                        Doctor Sign In
                    </Link>
                </p>            
            </div>
        </div>
    );
}

export default SignInPage