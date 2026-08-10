import { useState } from "react";
import { api } from "../lib/api.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { school } from "../data/content.js";

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const handle = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.name?.trim()) errs.name = "Name is required.";
    if (!values.email?.trim()) errs.email = "Email is required.";
    else if (!validEmail(values.email)) errs.email = "Enter a valid email address.";
    if (!values.message?.trim()) errs.message = "Message is required.";
    else if (values.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus({ ok: false, msg: "Please fix the highlighted fields." });
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      await api.submitContact(values);
      setStatus({ ok: true, msg: "Message sent. We'll get back to you soon!" });
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form-card contact-form" onSubmit={submit} noValidate>
      <div className="form-card__head">
        <h3>Leave Us a Message</h3>
        <p>And we will get back to you.</p>
      </div>
      <div className="form-grid">
        <label className={errors.name ? "has-error" : ""} htmlFor="contact-name">
          Name
          <input
            id="contact-name"
            name="name"
            value={values.name}
            onChange={handle}
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <span className="field-error" id="contact-name-error" role="alert">
              {errors.name}
            </span>
          )}
        </label>
        <label className={errors.email ? "has-error" : ""} htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handle}
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <span className="field-error" id="contact-email-error" role="alert">
              {errors.email}
            </span>
          )}
        </label>
        <label
          className={`form-grid__full ${errors.message ? "has-error" : ""}`}
          htmlFor="contact-message"
        >
          Message
          <textarea
            id="contact-message"
            name="message"
            rows="5"
            value={values.message}
            onChange={handle}
            placeholder="How can we help?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <span className="field-error" id="contact-message-error" role="alert">
              {errors.message}
            </span>
          )}
        </label>
      </div>
      <button className="btn btn--primary form-submit" type="submit" disabled={busy}>
        {busy ? "Sending…" : "Send Message"}
      </button>
      {status && (
        <p
          className={status.ok ? "form-msg form-msg--ok" : "form-msg"}
          role={status.ok ? "status" : "alert"}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
}

export default function Contact() {
  useSEO({
    title: "Contact Us",
    description: `Contact ${school.name}. ${school.address}.`,
    crumbs: [
      { name: "Home", url: "https://svpmasaka.rw/" },
      { name: "Contact Us", url: "https://svpmasaka.rw/contact" },
    ],
  });

  return (
    <>
      <PageHero eyebrow="Contact" title="Get in Touch" subtitle="We would love to hear from you." />

      <Reveal as="section" className="section">
        <div className="container">
          <div className="grid grid-2">
            <ContactForm />

            <div>
              <div className="card" style={{ padding: "28px" }}>
                <h3>Our Details</h3>
                <div className="contact-list">
                  <div>
                    <strong>Address</strong>
                    <p style={{ whiteSpace: "pre-line", margin: "4px 0 16px" }}>{school.address}</p>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <p style={{ margin: "4px 0 16px" }}>
                      <a href={`tel:${school.phone.replace(/\s/g, "")}`}>{school.phone}</a>
                    </p>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p style={{ margin: "4px 0 16px" }}>
                      <a href={`mailto:${school.email}`}>{school.email}</a>
                    </p>
                  </div>
                  <div>
                    <strong>Office Hours</strong>
                    <p style={{ margin: "4px 0 0" }}>{school.hours}</p>
                  </div>
                </div>
              </div>

              <div className="card contact-map" style={{ marginTop: "20px", overflow: "hidden" }}>
                <iframe
                  title={`Map to ${school.name}`}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=30.06%2C-2.01%2C30.13%2C-1.96&layer=mapnik&marker=-1.9851%2C30.0957"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}
