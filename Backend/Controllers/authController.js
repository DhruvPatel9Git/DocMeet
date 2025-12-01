const { userSignUpModel, userSignUpValidation, userSigninValidation, verificationOTPModel } = require('../Models/authModel')
const { doctorSigninModel } = require('../Models/doctorModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('../firebaseadmin');
const nodemailer = require('nodemailer')

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'namrashah56@gmail.com',
        pass: 'uidk phyi lqpr ntto'
    }
});

const userSignUpOtp = async (req, res) => {
    try {
        const { fullname, email, password } = req.body
        const securePass = bcrypt.hashSync(password, 10)
        const existingUser = await userSignUpModel.findOne({ email: email });
        if (!existingUser) {
            const otp = generateOTP();
            const expiry = new Date(Date.now() + 5 * 60 * 1000);
            newOTP = new verificationOTPModel({
                fullname,
                email,
                password: securePass,
                otp,
                otpExpiresAt: expiry
            })
            const { error } = userSignUpValidation.validate({ fullname, email, password }, { allowUnknown: true })

            if (error) {
                return res.status(400).send({ msg: "Validation error", error });
            }

            await newOTP.save();

            await transporter.sendMail({
                to: email,
                subject: 'DocMeet OTP for Password Reset',
                html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
            });

            res.send({
                msg: "OTP SENT SUCCESSFULLY"
            })
        }
    } catch (err) {
        console.log(err)
        res.send({
            msg: "error"
        })
    }

}

const userSignUp = async (req, res) => {
    const { otp, email } = req.body;

    try {
        const pending = await verificationOTPModel.findOne({ email });

        if (!pending) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userOtp = String(pending.otp).trim();
        const inputOtp = String(otp).trim();

        if (userOtp !== inputOtp) {
            return res.status(400).json({ message: 'Invalid OTP', verifyotpTRUE: false });
        }

        if (new Date() > pending.otpExpiresAt) {
            await verificationOTPModel.deleteOne({ email });
            res.status(400).json({ message: 'OTP expired', verifyotpTRUE: false });
        }

        if (userOtp == inputOtp) {
            newData = new userSignUpModel({
                fullname: pending.fullname,
                email: pending.email,
                password: pending.password
            })

            await newData.save()
            await verificationOTPModel.deleteOne({ email });
            res.status(200).json({ message: 'OTP verified', verifyotpTRUE: true });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const userSignin = async (req, res) => {
    const { email, password } = req.body


    if (email && password) {
        const { error } = userSigninValidation.validate({ email: email, password: password }, { allowUnknown: true })
        if (!error) {
            const getUserData = await userSignUpModel.findOne({
                email
            })
            try {
                if (getUserData) {
                    const checkPass = bcrypt.compareSync(password, getUserData.password)
                    
                    if (checkPass) {
                        const token = jwt.sign({ email: getUserData.email },
                            "abc", { expiresIn: '1h' }
                        )
                        res.status(200).send({
                            token: token
                        })
                    }
                    else {
                        res.status(404).send({
                            msg: "Password Error"
                        })
                    }
                }
            }
            catch {
                res.status(404).send({
                    "msg": "Email & Password Not Found"
                })
            }
        }
    }
    else {
        res.send({ "msg": "All Fields Must Be Filled" })
    }
}

const userGoogleSignin = async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(400).send({ isSuccess: false, msg: "Token is required" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const email = decodedToken.email;
        const uid = decodedToken.uid;
        
        let existingUser = await userSignUpModel.findOne({ email });
        
        if (!existingUser) {
            const newUser = new userSignUpModel({
                fullname: decodedToken.name || "Google User",
                email,
                password: null,
                picture: decodedToken.picture,
                loginMethod: 'google',
                firebaseUID: uid
            });
            existingUser = await newUser.save();
        }
        
        const jwtToken = jwt.sign({ email, userId: existingUser._id }, "abc", { expiresIn: '1h' });
        res.status(200).send({ isSuccess: true, token: jwtToken });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        const errorMsg = error.code === 'auth/id-token-expired' 
            ? "Token expired. Please try again."
            : error.message || "Google authentication failed";
        res.status(401).send({ isSuccess: false, msg: errorMsg });
    }
};



const resetpassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userSignUpModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min from now

        user.otp = otp;
        user.otpExpiresAt = expiry;
        await user.save();

        await transporter.sendMail({
            to: email,
            subject: 'DocMeet OTP for Password Reset',
            html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
        });

        res.status(200).json({ message: 'OTP sent to email' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const verifyotp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userSignUpModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Make sure comparison is done correctly (both strings, trimmed)
        const userOtp = String(user.otp).trim();
        const inputOtp = String(otp).trim();

        if (userOtp !== inputOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.status(200).json({ message: 'OTP verified' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const newpassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await userSignUpModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const doctorSignin = async (req, res) => {
    const { doctorEmail, doctorPassword } = req.body
    if (doctorEmail && doctorPassword) {
        const getDoctorData = await doctorSigninModel.findOne({
            doctorEmail:doctorEmail
        })
        try {
            if (getDoctorData) {
                if(getDoctorData.doctorEmail == doctorEmail && getDoctorData.doctorPassword == doctorPassword){
                    const tokenDoctor = jwt.sign({ doctorEmail: getDoctorData.doctorEmail,_id: getDoctorData._id },
                    "abc", { expiresIn: '1h' }
                    )
                    res.status(200).send({
                        tokenDoctor: tokenDoctor
                    })
                }
            } else {
                console.log("Password error")
                res.status(404).send({
                    msg: "Password Error"
                })
            }
        }
        catch {
            res.status(404).send({
                "msg": "Email & Password Not Found"
            })
        }
    }
    else {
        res.send({ "msg": "All Fields Must Be Filled" })
    }
}



module.exports = { userSignUpOtp, userSignUp, userSignin, userGoogleSignin, resetpassword, verifyotp, newpassword,doctorSignin }