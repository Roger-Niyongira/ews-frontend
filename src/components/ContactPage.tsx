import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    inquiry: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    alert("Submitted");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div
              className="px-4 px-md-5 py-4 text-white"
              style={{
                background:
                  "linear-gradient(135deg, #0d6efd 0%, #198754 100%)",
              }}
            >
              <h2 className="mb-2">Get in touch with the our team</h2>
              <p className="mb-0 opacity-75">
                Send us your question, feedback, or partnership inquiry and we
                will respond as soon as possible.
              </p>
            </div>

            <div className="card-body p-4 p-md-5 bg-white">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label fw-semibold">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      placeholder="Enter your first name"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label fw-semibold">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      placeholder="Enter your last name"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      placeholder="name@example.com"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      placeholder="+1 234 567 8900"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="organization"
                      className="form-label fw-semibold"
                    >
                      Organization
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      value={form.organization}
                      placeholder="Agency, institution, or company"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="inquiry" className="form-label fw-semibold">
                      Message
                    </label>
                    <textarea
                      id="inquiry"
                      name="inquiry"
                      value={form.inquiry}
                      placeholder="Tell us how we can help you"
                      className="form-control"
                      rows={6}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pt-2">
                    <p className="text-muted mb-0">
                      We typically reply within 1 to 2 business days.
                    </p>

                    <button type="submit" className="btn btn-primary btn-lg px-4">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
