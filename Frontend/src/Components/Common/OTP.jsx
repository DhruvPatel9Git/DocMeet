import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom'

function OTP() {
    const [otp, setOtp] = useState('');
    const [email,setEmail] = useState('');
    let navigate = useNavigate()

    useEffect(()=>{
        setEmail(localStorage.getItem('userEmail'))
    },[])

    const handleOtpSubmit = () => {
        axios.post('http://localhost:5001/docmeet/user/signup', { otp, email }, {
            headers: { "Content-Type": "application/json" }
        })
        .then((res)=>{
            if(res.data.verifyotpTRUE == true){
                console.log(res)
                localStorage.removeItem('userEmail')
                navigate('/user/dashboard')
            }
            else if(res.data.verifyotpTRUE == false){
                alert("Wrong OTP")
            }
        })
        .catch(err => {
            console.log("err",err)
        });
    };

    
    return (
        <div className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-2 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <label className='text-sm font-medium mt-2'>Enter OTP</label>
                <input
                    type="text"
                    className='border border-zinc-300 rounded w-full p-2'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleOtpSubmit} className='bg-[#5D6BFF] text-white w-full py-2 rounded-lg mt-3'>Verify OTP</button>
            </div>
        </div>
    );
}

export default OTP;