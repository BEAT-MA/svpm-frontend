import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { settings as defaultSettings } from "../data/content.js";

function get(s, key, fallback) {
  const found = (s.length ? s : defaultSettings).find((x) => x.key === key);
  return found?.value || fallback;
}

export default function Footer({ settings }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const subscribe = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await api.newsletter(email);
      setStatus({ ok: true, msg: "Thanks for subscribing!" });
      setEmail("");
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <img
                src="/logo.png"
                alt="Saint Vincent Pallotti School Masaka logo"
                className="footer__logo"
              />
              <div>
                <h4 className="footer__heading" style={{ margin: 0 }}>
                  {get(
                    settings,
                    "school_name",
                    defaultSettings.find((x) => x.key === "school_name")?.value
                  )}
                </h4>
                <p>
                  {get(
                    settings,
                    "school_tagline",
                    defaultSettings.find((x) => x.key === "school_tagline")?.value
                  )}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/academics">Academics</Link>
              </li>
              <li>
                <Link to="/admissions">Admissions</Link>
              </li>
              <li>
                <Link to="/news-events">News & Events</Link>
              </li>
              <li>
                <Link to="/student-life">Student Life</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__list">
              <li>
                {get(
                  settings,
                  "school_address",
                  "Masaka Sector, Kicukiro District, Kigali, Rwanda"
                )}
              </li>
              <li>
                <a href={`tel:${get(settings, "school_phone", "")}`}>
                  {get(settings, "school_phone", "+250 788 602 647")}
                </a>
              </li>
              <li>
                <a href={`mailto:${get(settings, "school_email", "info@svpmasaka.rw")}`}>
                  {get(settings, "school_email", "info@svpmasaka.rw")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="footer__heading">Newsletter</h4>
            <form onSubmit={subscribe} className="footer__news">
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn--primary" type="submit">
                Subscribe
              </button>
            </form>
            {status && (
              <p className={status.ok ? "footer__status footer__status--ok" : "footer__status"}>
                {status.msg}
              </p>
            )}
          </div>
        </div>
        <div className="footer__bottom">
          © {new Date().getFullYear()}{" "}
          {get(settings, "school_name", "Saint Vincent Pallotti School Masaka")}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
