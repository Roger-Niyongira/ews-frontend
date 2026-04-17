import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiry: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
    alert("Submitted");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h3 className="mb-3">Get in Touch</h3>

      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" className="form-control mb-2" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" className="form-control mb-2" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" className="form-control mb-2" onChange={handleChange} />
        <textarea name="inquiry" placeholder="Your inquiry..." className="form-control mb-3" onChange={handleChange} required />

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactPage;