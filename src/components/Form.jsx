import React, { useEffect, useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch("http://localhost:5000/api/blogs");
      const data = await response.json();
      console.log(data);
    };

    fetchBlogs();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(formData);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Blog Form</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Title"
          required
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Description"
          required
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Image"
          required
          name="image"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
