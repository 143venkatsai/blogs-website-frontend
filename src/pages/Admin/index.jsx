import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { HiOutlineXMark } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";

const Admin = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modelDlete, SetModelDlete] = useState(false);
  const [name, setName] = useState("");
  const [userModal, setUserModal] = useState(false);

  const fetchBlogs = async () => {
    const response = await fetch("http://localhost:5000/api/blogs");
    const data = await response.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleClick = () => {
    navigate("/create-blog");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
    }
    if (user.role !== "admin") {
      navigate("/");
    }

    const parsedUser = JSON.parse(user);
    if (parsedUser.name) {
      setName(parsedUser.name);
    }
  }, []);
  console.log(name);

  const openModal = (blog) => {
    setIsModelOpen(!isModelOpen);
    setSelectedBlog(blog);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `http://localhost:5000/api/blog/${selectedBlog._id}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(selectedBlog),
      };
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        fetchBlogs();
        setIsModelOpen(false);
        alert("Blog updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const apiUrl = `http://localhost:5000/api/blog/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        fetchBlogs();
        alert("Blog deleted successfully");
        SetModelDlete(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openDeleteModal = (blog) => {
    SetModelDlete(!modelDlete);
    setSelectedBlog(blog);
  };

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
              width: "100%",
              boxSizing: "border-box",
              padding: "0px 20px",
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
            <div>
              <button onClick={handleClick}> + Add Blog</button>
            </div>
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
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginLeft: "auto",
                  }}
                >
                  <FaRegEdit
                    size={24}
                    style={{
                      cursor: "pointer",
                      color: "blue",
                    }}
                    onClick={() => openModal(blog)}
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

      {isModelOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
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
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              gap: "20px",
            }}
          >
            <HiOutlineXMark
              size={26}
              style={{ marginLeft: "auto", cursor: "pointer" }}
              onClick={() => setIsModelOpen(!isModelOpen)}
            />
            <h1 style={{ textAlign: "center", fontSize: "20px", margin: "0" }}>
              Edit Blog
            </h1>
            <form
              onSubmit={handleUpdate}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="text"
                value={selectedBlog.title}
                placeholder="Title"
                style={{ padding: "8px" }}
                onChange={(e) =>
                  setSelectedBlog({ ...selectedBlog, title: e.target.value })
                }
              />
              <input
                type="text"
                value={selectedBlog.description}
                placeholder="Description"
                style={{ padding: "8px" }}
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
                placeholder="Upload Image URL"
                style={{ padding: "8px" }}
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

      {modelDlete && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              gap: "20px",
            }}
          >
            <HiOutlineXMark
              size={26}
              style={{ marginLeft: "auto", cursor: "pointer" }}
              onClick={() => SetModelDlete(!modelDlete)}
            />
            <h1 style={{ textAlign: "center", fontSize: "20px", margin: "0" }}>
              Are you sure you want to delete this blog?
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <button
                style={{ background: "green", padding: "10px 20px" }}
                onClick={() => deleteBlog(selectedBlog._id)}
              >
                Yes
              </button>
              <button
                style={{ background: "red", padding: "10px 20px" }}
                onClick={() => SetModelDlete(!modelDlete)}
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
