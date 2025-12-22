import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";

import blogsData from "../../mockData/blogsdata";

import "./index.css";

const User = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [pageBlogs, setPageBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [search, setSearch] = useState("");
  console.log(search);

  // Auth check (ProtectedRoute already handles most cases)
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login", { replace: true });
      return;
    }

    const user = JSON.parse(userData);

    // If admin somehow lands here → redirect
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    if (user.name) {
      setName(user.name);
    }
  }, [navigate]);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `https://blogs-website-backend-9yg1.onrender.com/api/blogs?search=${search}`
        );
        const data = await response.json();
        console.log(data);
        setBlogs(data);
        setBlogs((prev) => [...prev, ...blogsData]);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs();
  }, [search]);

  const userName = name ? name[0].toUpperCase() + name.slice(1) : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const blogsPerPage = 6;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    setPageBlogs(blogs.slice(startIndex, endIndex));
  }, [blogs, currentPage]);

  const handlePage = (page) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      {/* Header */}
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

        <div style={{ position: "relative" }}>
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
              onClick={() => setUserModal((prev) => !prev)}
            >
              <p style={{ fontSize: "20px" }}>{name[0].toUpperCase()}</p>

              {userModal && (
                <div
                  style={{
                    position: "absolute",
                    top: "60px",
                    right: "0",
                    backgroundColor: "#ccc",
                    padding: "10px 20px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                    width: "200px",
                    zIndex: 10,
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
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 10px",
        }}
      >
        {/* Search */}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {/* Blogs */}
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
          {pageBlogs.map((blog, index) => (
            <div
              key={index}
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
              <h1 style={{ margin: 0 }}>{blog.title}</h1>
              <p style={{ margin: 0 }}>{blog.description}</p>
              <img
                src={blog.image}
                alt={blog.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ border: "1px solid #ccc", marginTop: "20px" }}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePage(index + 1)}
              style={{
                fontWeight: currentPage === index + 1 ? "bold" : "normal",
              }}
            >
              {index + 1}
            </button>
          ))}

          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
