import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
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
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("User created successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
        });
        navigate("/login");
      } else {
        console.log("Error creating user");
        setError(true);
        setErrorMsg(data.message);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="signup-container">
        <h1>Sign Up </h1>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
          <div className="input-container">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          {error && (
            <p style={{ color: "red", margin: "0", fontSize: "14px" }}>
              *{errorMsg}
            </p>
          )}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
