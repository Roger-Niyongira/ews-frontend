import React, { useState } from "react";

const CONTACT_EMAIL = "hydromodservices@gmail.com";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organization: "",
  inquiry: "",
};

const ContactPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitTone, setSubmitTone] = useState<"success" | "warning" | "danger">(
    "success"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildMailtoUrl = () => {
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const subject = encodeURIComponent(
      `Contact request from ${fullName || form.email}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${fullName}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone || "Not provided"}`,
        `Organization: ${form.organization || "Not provided"}`,
        "",
        "Message:",
        form.inquiry,
      ].join("\n")
    );

    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          recipient: CONTACT_EMAIL,
          source: "contact-page",
        }),
      });

      if (!response.ok) {
        let errorMessage = "Unable to send your message right now.";

        try {
          const data = await response.json();
          errorMessage = data.detail || data.error || errorMessage;
        } catch {
          // Keep the generic message when the backend does not return JSON.
        }

        throw new Error(errorMessage);
      }

      setSubmitTone("success");
      setSubmitMessage(
        "Thanks. Your message has been sent to Hydromod Services."
      );
      setForm(initialForm);
    } catch {
      window.location.href = buildMailtoUrl();
      setSubmitTone("warning");
      setSubmitMessage(
        "We're unable to submit your message right now. Please use the email window that opened to message us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="mb-0 mt-3">
                Email us directly:{" "}
                <a
                  className="link-light fw-semibold"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
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

                  <div className="col-12 d-flex justify-content-center pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>

                  {submitMessage && (
                    <div className="col-12">
                      <div
                        className={`alert alert-${submitTone} mb-0`}
                        role="status"
                      >
                        {submitMessage} You can also email{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>
                          {CONTACT_EMAIL}
                        </a>
                        .
                      </div>
                    </div>
                  )}
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
