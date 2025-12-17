import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";

const User = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [name, setName] = useState("");
  const [userModal, setUserModal] = useState(false);

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

    if (parsedUser.name) {
      setName(parsedUser.name);
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

  const nameLength = name.length;

  const userName = name
    ? name[0].toLocaleUpperCase() + name.slice(1, nameLength)
    : null;

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
          <div style={{ position: "realtive" }}>
            {name && (
              <div
                style={{
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => setUserModal(!userModal)}
              >
                <p style={{ fontSize: "20px" }}>
                  {name[0].toLocaleUpperCase()}
                </p>
                {userModal && (
                  <div
                    style={{
                      position: "absolute",
                      top: "80px",
                      right: "10px",
                      backgroundColor: "#ccc",
                      padding: "10px 20px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "5px",
                      width: "200px",
                    }}
                  >
                    <h2 style={{ color: "#000" }}>{userName}</h2>
                    <p
                      style={{
                        cursor: "pointer",
                        color: "#000",
                        backgroundColor: "#fff",
                        padding: "8px 10px",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      onClick={() => {
                        localStorage.removeItem("user");
                        navigate("/login");
                      }}
                    >
                      <FiLogOut /> Logout
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* <button>Logout</button> */}
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
