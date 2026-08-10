import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions", label: "Admissions" },
  { to: "/departments", label: "Departments" },
  { to: "/news-events", label: "News & Events" },
  { to: "/student-life", label: "Student Life" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const schoolName = settings.find((s) => s.key === "school_name")?.value || "SVPM";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const firstFocusable = navRef.current?.querySelector("a, button");
    firstFocusable?.focus();
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" onClick={close}>
          <img
            src="/logo.png"
            alt={`${schoolName} logo`}
            className="nav__logo"
            width="40"
            height="40"
          />
          <span className="nav__title">{schoolName}</span>
        </Link>

        <nav
          ref={navRef}
          id="site-menu"
          className={`nav__links ${open ? "nav__links--open" : ""}`}
          aria-label="Main navigation"
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
              onClick={close}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/admissions" className="btn btn--primary nav__cta" onClick={close}>
            Apply Now
          </Link>
        </nav>

        <button
          ref={toggleRef}
          className="nav__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__bar"></span>
          <span className="nav__bar"></span>
          <span className="nav__bar"></span>
        </button>
      </div>
    </header>
  );
}
