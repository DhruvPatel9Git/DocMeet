import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);


    const handleEmailSubmit = () => {
        setLoading(true);
        axios.post('http://localhost:5001/docmeet/user/resetpassword', { email })
            .then(res => {
                setMessage("OTP sent to your email.");
                setStep(2);
            })
            .catch(err => {
                setMessage("Email not found.");
            })
            .finally(() => setLoading(false));
    };

    const handleOtpSubmit = () => {
        axios.post('http://localhost:5001/docmeet/user/verifyotp', { email, otp })
            .then(res => {
                setMessage("OTP verified. Enter new password.");
                setStep(3);
            })
            .catch(err => {
                setMessage("Invalid OTP.");
            });
    };

    const handleResetPassword = () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        axios.post('http://localhost:5001/docmeet/user/newpassword', {
            email,
            newPassword
        })
            .then(res => {
                setMessage("Password successfully changed.");
                setStep(4);
            })
            .catch(err => {
                setMessage("Error resetting password.");
            });
    };

    return (
        <div className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-2 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>Forgot Password</p>
                <p className='text-sm text-zinc-500'>Reset your password securely</p>

                {message && <p className='text-red-500 text-sm'>{message}</p>}

                {step === 1 && (
                    <>
                        <label className='text-sm font-medium mt-2'>Enter your email</label>
                        <input
                            type="email"
                            className='border border-zinc-300 rounded w-full p-2'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={handleEmailSubmit}
                            className='bg-[#5D6BFF] text-white w-full py-2 rounded-lg mt-3 disabled:opacity-60'
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>                    </>
                )}

                {step === 2 && (
                    <>
                        <label className='text-sm font-medium mt-2'>Enter OTP</label>
                        <input
                            type="text"
                            className='border border-zinc-300 rounded w-full p-2'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={handleOtpSubmit} className='bg-[#5D6BFF] text-white w-full py-2 rounded-lg mt-3'>Verify OTP</button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <label className='text-sm font-medium mt-2'>New Password</label>
                        <input
                            type="password"
                            className='border border-zinc-300 rounded w-full p-2'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label className='text-sm font-medium mt-2'>Confirm Password</label>
                        <input
                            type="password"
                            className='border border-zinc-300 rounded w-full p-2'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleResetPassword} className='bg-[#5D6BFF] text-white w-full py-2 rounded-lg mt-3'>Reset Password</button>
                    </>
                )}

                {step === 4 && (
                    <p className='text-green-600'>You may now <Link to="/user/signin" className="text-[#5D6BFF] text-sm underline">
                        Signin
                    </Link></p>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;