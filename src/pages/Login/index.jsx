import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://blogs-website-backend-9yg1.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(true);
        setErrorMsg(data.message || "Login failed");
        return;
      }

      // Save user & token separately
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      alert("User logged in successfully");

      // Clear form
      setFormData({
        email: "",
        password: "",
      });

      // Role based redirect
      if (data.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMsg("Something went wrong. Try again.");
    }
  };

  return (
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
              <FaRegEye onClick={() => setShowPassword(false)} />
            ) : (
              <FaRegEyeSlash onClick={() => setShowPassword(true)} />
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
          <p style={{ color: "red", margin: 0, fontSize: "14px" }}>
            * {errorMsg}
          </p>
        )}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
