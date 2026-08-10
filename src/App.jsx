import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { api } from "./lib/api.js";
import Home from "./pages/Home.jsx";

const About = lazy(() => import("./pages/About.jsx"));
const Academics = lazy(() => import("./pages/Academics.jsx"));
const Admissions = lazy(() => import("./pages/Admissions.jsx"));
const Departments = lazy(() => import("./pages/Departments.jsx"));
const NewsEvents = lazy(() => import("./pages/NewsEvents.jsx"));
const NewsArticle = lazy(() => import("./pages/NewsArticle.jsx"));
const StudentLife = lazy(() => import("./pages/StudentLife.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <span className="spinner" />
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    api
      .settings()
      .then((d) => setSettings(Array.isArray(d) ? d : d.data || []))
      .catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Navbar settings={settings} />
        <main id="main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/news-events" element={<NewsEvents />} />
              <Route path="/news-events/:id" element={<NewsArticle />} />
              <Route path="/student-life" element={<StudentLife />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer settings={settings} />
        <BackToTop />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
