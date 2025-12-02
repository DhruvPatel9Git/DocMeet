
# 🏥 DocMeet – Smart Doctor Appointment & Management System

DocMeet is a full-stack medical appointment platform that connects **patients**, **doctors**, and **admins**.  
It allows users to book appointments, manage schedules, handle authentication with OTP, and provides a secure backend with role-based access.

---

## 🚀 Features

### 👨‍⚕️ Patient Features
- User signup & login (Email + OTP verification)
- View list of doctors by specialization
- Book appointments
- View & manage upcoming appointments
- Edit profile
- Secure JWT authentication

### 🧑‍⚕️ Doctor Features
- Doctor signup/login
- Manage availability and time slots
- View patient appointments
- Accept / Reject appointments
- Profile management

### 🛠️ Admin Features
- Admin login
- Add / Edit / Delete doctors
- Manage all appointments
- View platform analytics
- Block/unblock users

---

## 🧰 Tech Stack

### **Frontend**
- React.js
- React Router
- Axios
- TailwindCSS / CSS Modules

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Joi Validation
- JWT Authentication
- SendGrid / Nodemailer for OTP email

---

## 📁 Folder Structure

```

DocMeet/
│
├── Backend/
│   ├── Controllers/
│   ├── doctorAddedPrescription/
│   ├── Models/
│   ├── Routes/
│   ├── uploads/
│   ├── dbconfig.js
│   ├── docMeetIndex.js
│   ├── firebaseadmin.js
│   ├── fixDatabase.js
│   └── package.json
│
└── Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── Pages/
│   ├── App.jsx
│   └── main.jsx
└── package.json

```

---

## 🔐 Authentication

### ✔️ User Sign Up  
- Email → Verify with OTP  
- Password hashed using **bcrypt**  

### ✔️ Sign In  
- Validated with **Joi**  
- Access Token generated using **JWT**

---

## 📬 Email / OTP Setup

Create a `.env` file in the backend:

```

SENDGRID_API_KEY=your-key
MAIL_FROM=[no-reply@yourdomain.com](mailto:no-reply@yourdomain.com)

# Optional fallback SMTP

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=[your-email@gmail.com](mailto:your-email@gmail.com)
MAIL_PASS=your-gmail-app-password

```

---

## 🗄️ Environment Variables

```

PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret
SENDGRID_API_KEY=your-api-key
CLIENT_URL=[http://localhost:5173](http://localhost:5173)

````

---

## ▶️ Running the Project

### **Run Backend**
```bash
cd Backend
npm install
npm run dev
````

### **Run Frontend**

```bash
cd Frontend
npm install
npm run dev
```

---

## 📡 API Endpoints (Summary)

### **Auth Routes**

| Method | Route             | Description   |
| ------ | ----------------- | ------------- |
| POST   | `/user/signup`    | Register user |
| POST   | `/user/signin`    | Login user    |
| POST   | `/user/signupOtp` | Verify OTP    |

### **Admin Routes**

| POST | `/admin/signin` |
| GET  | `/admin/getDoctors` |
| DELETE | `/admin/deleteDoctor/:id` |

(You can ask for full API documentation)

---

## 🧩 Validation (Joi)

```js
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
```

---

## 🌍 Deployment

### **Frontend:** Vercel 

### **Backend:** Render

### **Database:** MongoDB Atlas

---

## 📝 Conclusion

DocMeet simplifies doctor-patient management with a clean UI and secure backend architecture.
It is scalable, reliable, and suitable for clinics, hospitals, and telemedicine platforms.

---



