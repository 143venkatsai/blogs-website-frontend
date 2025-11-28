import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const User = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
    if (user.role === "admin") {
      navigate("/admin");
    }
  }, []);

  return <div>User Dashboard</div>;
};

export default User;
