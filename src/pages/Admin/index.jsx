import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { HiOutlineXMark } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";

import blogsData from "../../mockData/blogsdata";

const Admin = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [name, setName] = useState("");
  const [userModal, setUserModal] = useState(false);

  // Auth check
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login", { replace: true });
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    if (user.name) {
      setName(user.name);
    }
  }, [navigate]);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/blogs");
      const data = await response.json();
      console.log(data);
      setBlogs(data);
      setBlogs((prev) => [...prev, ...blogsData]);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/blog/${selectedBlog._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(selectedBlog),
        }
      );

      if (response.ok) {
        fetchBlogs();
        setIsModalOpen(false);
        alert("Blog updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBlog = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/blog/${selectedBlog._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchBlogs();
        setIsDeleteModalOpen(false);
        alert("Blog deleted successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const userName = name ? name[0].toUpperCase() + name.slice(1) : "";

  return (
    <>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
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

            <button onClick={() => navigate("/create-blog")}>+ Add Blog</button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              marginTop: "40px",
              padding: "20px",
            }}
          >
            {blogs.map((blog, index) => (
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
                <h1>{blog.title}</h1>
                <p>{blog.description}</p>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{ display: "flex", gap: "8px", marginLeft: "auto" }}
                >
                  <FaRegEdit
                    size={24}
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => openEditModal(blog)}
                  />
                  <MdOutlineDelete
                    size={24}
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => openDeleteModal(blog)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedBlog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "400px",
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <HiOutlineXMark
              size={26}
              style={{ marginLeft: "auto", cursor: "pointer" }}
              onClick={() => setIsModalOpen(false)}
            />

            <h1 style={{ textAlign: "center" }}>Edit Blog</h1>

            <form
              onSubmit={handleUpdate}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                value={selectedBlog.title}
                onChange={(e) =>
                  setSelectedBlog({ ...selectedBlog, title: e.target.value })
                }
              />
              <input
                type="text"
                value={selectedBlog.description}
                onChange={(e) =>
                  setSelectedBlog({
                    ...selectedBlog,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="text"
                value={selectedBlog.image}
                onChange={(e) =>
                  setSelectedBlog({ ...selectedBlog, image: e.target.value })
                }
              />
              <button type="submit" style={{ background: "green" }}>
                Update Blog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "400px",
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <HiOutlineXMark
              size={26}
              style={{ marginLeft: "auto", cursor: "pointer" }}
              onClick={() => setIsDeleteModalOpen(false)}
            />

            <h1 style={{ textAlign: "center" }}>
              Are you sure you want to delete this blog?
            </h1>

            <div
              style={{ display: "flex", gap: "20px", justifyContent: "center" }}
            >
              <button style={{ background: "green" }} onClick={deleteBlog}>
                Yes
              </button>
              <button
                style={{ background: "red" }}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
