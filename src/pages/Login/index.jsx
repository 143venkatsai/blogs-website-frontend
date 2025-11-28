import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert("User Loggedin successfully");
        setFormData({
          email: "",
          password: "",
          role: "",
        });
        localStorage.setItem("user", JSON.stringify(data));
        if (data.role === "admin") {
          console.log(data.role);
          return navigate("/admin");
        } else {
          return navigate("/");
        }
      } else {
        console.log("Error login user");
        setError(true);
        setErrorMsg(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="login-container">
        <h1>Login</h1>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-container">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label>Password</label>
              {showPassword ? (
                <FaRegEye onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} />
              )}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          {error && (
            <p style={{ color: "red", margin: "0", fontSize: "14px" }}>
              *{errorMsg}
            </p>
          )}
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;
