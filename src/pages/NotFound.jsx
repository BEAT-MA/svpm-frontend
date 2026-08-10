import { Link } from "react-router-dom";
import { useSEO } from "../lib/seo.js";

export default function NotFound() {
  useSEO({
    title: "Page Not Found",
    description: "The page you are looking for could not be found.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Page Not Found",
      url: window.location.href,
    },
    crumbs: [{ name: "Home", url: "https://svpmasaka.rw/" }],
  });

  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <span className="not-found__code">404</span>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn--primary">
            Back to Home
          </Link>
          <Link to="/news-events" className="btn btn--outline">
            News & Events
          </Link>
        </div>
      </div>
    </section>
  );
}
