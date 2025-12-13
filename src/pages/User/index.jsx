import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";

const User = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (parsedUser.role === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch("http://localhost:5000/api/blogs");
      const data = await response.json();
      console.log(data);
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <div>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 20px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1>Blogs</h1>
          <button>Logout</button>
        </header>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              border: "1px solid #323f4b",
              padding: "10px",
              width: "30%",
            }}
          >
            <input
              type="search"
              placeholder="Search Blogs..."
              style={{
                border: "none",
                fontSize: "16px",
                outline: "none",
                width: "100%",
              }}
            />
            <GoSearch size={20} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginTop: "40px",
              padding: "20px",
            }}
          >
            {blogs.map((blog) => (
              <div
                key={blog._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                  width: "300px",
                  padding: "20px",
                }}
              >
                <h1 style={{ margin: "0" }}>{blog.title}</h1>
                <p style={{ margin: "0" }}>{blog.description}</p>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
