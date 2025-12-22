import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";

const Blog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://blogs-website-backend-9yg1.onrender.com/api/blog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Create New Blog</h1>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={handleSubmit}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              placeholder="Enter Title"
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              placeholder="Enter Description"
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label htmlFor="image">Image</label>
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              placeholder="Upload Image URL"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      {/* <Form /> */}
    </>
  );
};

export default Blog;
