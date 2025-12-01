import React from "react";
import "../../assets/styles/signUpPage.css"
import signUp from "../../assets/images/signUpImage.jpg"

function SignupPage() {

    return (
        <div
            className="container-fluid"
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                backgroundImage: "linear-gradient(to right, #a1ffce, #faffd1)",
            }}
        >
            <div
                className="registration-wrapper"
                style={{
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "center",
                    width: "80%",
                    maxWidth: "1000px",
                    borderRadius: "15px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#fff",
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                <div
                    className="image-container"
                    style={{
                        flex: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={signUp}
                        alt="Registration Logo"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "brightness(0.9)",
                            transition: "filter 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
                    />
                </div>
                <div
                    className="form-container"
                    style={{
                        flex: "1",
                        padding: "40px",
                        backgroundColor: "white",
                        borderRadius: "0 15px 15px 0",
                        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h1
                        style={{
                            textAlign: "center",
                            marginBottom: "20px",
                            color: "#248a83",
                            fontWeight: "600",
                        }}
                    >
                        SignUp
                    </h1>
                    <input
                        type="text"
                        name="uname"
                        placeholder="Enter Username"
                        className="input"
                        style={{
                            width: "100%",
                            padding: "12px",
                            margin: "10px 0",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#248a83")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        className="input"
                        style={{
                            width: "100%",
                            padding: "12px",
                            margin: "10px 0",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#248a83")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    />
                    <input
                        type="password"
                        name="upass"
                        placeholder="Enter Password"
                        className="input"
                        style={{
                            width: "100%",
                            padding: "12px",
                            margin: "10px 0",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#248a83")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    />
                    <button
                        className="button"
                        style={{
                            backgroundColor: "#248a83",
                            color: "white",
                            width: "100%",
                            padding: "12px",
                            borderRadius: "5px",
                            marginTop: "10px",
                            fontSize: "16px",
                            fontWeight: "600",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#1c6d65")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#248a83")}
                    >
                        SignUp
                    </button>
                    <button
                        className="link"
                        style={{
                            background: "none",
                            border: "none",
                            color: "#248a83",
                            cursor: "pointer",
                            marginTop: "10px",
                            display: "block",
                            textAlign: "center",
                            textDecoration: "underline",
                            transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#1c6d65")}
                        onMouseLeave={(e) => (e.target.style.color = "#248a83")}
                    >
                        Already have an account? Click here to login.
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
