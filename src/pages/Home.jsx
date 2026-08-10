import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { useFetch, useInView, useCountUp } from "../lib/hooks.js";
import { useSEO, websiteSchema } from "../lib/seo.js";
import Testimonials from "../components/Testimonials.jsx";
import Reveal from "../components/Reveal.jsx";
import { NewsCard, EventCard } from "../components/cards.jsx";
import { Img, Empty, ErrorState, SkeletonGrid } from "../components/ui.jsx";
import {
  home as homeContent,
  news as newsContent,
  events as eventContent,
  gallery as galleryContent,
} from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

const FEATURE_ICONS = [
  <path key="cap" d="M22 9L12 4 2 9l10 5 10-5z" />,
  <path
    key="heart"
    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
  />,
  <path key="user" d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />,
  <path key="shield" d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />,
  <path key="monitor" d="M8 21h8M12 17v4" />,
  <path key="star" d="M12 3l2.1 6.2L20 12l-5.9 2.8L12 21l-2.1-6.2L4 12l5.9-2.8L12 3z" />,
];

function FeatureIcon({ index }) {
  return (
    <div className="feature-icon">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {FEATURE_ICONS[index % FEATURE_ICONS.length]}
      </svg>
    </div>
  );
}

function Stat({ value, label }) {
  const { ref, inView } = useInView();
  const str = String(value);
  const num = parseInt(str.replace(/\D/g, ""), 10) || 0;
  const suffix = str.replace(/[0-9]/g, "");
  const count = useCountUp(num, { start: inView });
  return (
    <div ref={ref} className="stat">
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

function Stats({ page }) {
  let items = [];
  const stats = page?.sections?.filter((s) => s.sectionKey === "stats_counter");
  if (stats && stats.length > 0) {
    const first = stats[0].content?.items || stats[0].content || [];
    if (Array.isArray(first) && first.length > 0) items = first;
  }
  if (items.length === 0) items = homeContent.stats;
  if (items.length === 0) return null;
  return (
    <section className="section section--dark">
      <div className="container">
        <div className="grid grid-4">
          {items.map((it, i) => (
            <Stat key={i} value={it.value} label={it.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <Reveal as="section" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Empowering young minds through academic excellence, Christian values, discipline, and
            holistic education.
          </p>
        </div>
        <div className="grid grid-3">
          {homeContent.features.map((f, i) => (
            <div key={i} className="card" style={{ padding: "28px" }}>
              <FeatureIcon index={i} />
              <h3>{f.title}</h3>
              <p style={{ margin: 0 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function PrincipalWelcome() {
  return (
    <Reveal as="section" className="section section--muted">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Principal's Welcome</span>
          <h2 className="section-title">A Message from Our Principal</h2>
        </div>
        <blockquote className="principal-welcome">
          <p>“{homeContent.principalWelcome}”</p>
        </blockquote>
      </div>
    </Reveal>
  );
}

export default function Home() {
  const home = useFetch((opts) => api.getPage("home", opts));
  const news = useFetch((opts) => api.list("news", "?featured=true&limit=3", opts));
  const events = useFetch((opts) => api.list("events", "?upcoming=true&limit=3", opts));
  const testimonials = useFetch((opts) => api.list("testimonials", "?featured=true", opts));
  const gallery = useFetch((opts) => api.list("gallery", "?limit=6", opts));

  useSEO({
    title: "Welcome to Saint Vincent Pallotti School Masaka",
    description: homeContent.hero.subheading,
    keywords:
      "SVPM, Saint Vincent Pallotti School Masaka, Catholic school Kigali, private day school Rwanda, early years, primary, secondary",
    jsonLd: [
      websiteSchema(),
      {
        "@context": "https://schema.org",
        "@type": "School",
        "@id": "https://svpmasaka.rw/#school",
        name: "Saint Vincent Pallotti School Masaka",
        alternateName: ["SVPM", "Saint Vincent Pallotti Masaka"],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Masaka Sector",
          addressLocality: "Kicukiro District, Kigali",
          addressCountry: "RW",
        },
        telephone: "+250 788 602 647",
        email: "info@svpmasaka.rw",
        url: "https://svpmasaka.rw",
        description: homeContent.hero.subheading,
        areaServed: ["Kigali", "Rwanda"],
      },
    ],
    crumbs: [{ name: "Home", url: "https://svpmasaka.rw/" }],
  });

  const page = home.data;
  const hero = page?.sections?.find((s) => s.sectionKey === "hero_banner");
  const heroContent = hero?.content || {};

  const newsItems = resultData(news.data).length ? resultData(news.data) : newsContent;
  const eventItems = resultData(events.data).length ? resultData(events.data) : eventContent;
  const galleryItems = resultData(gallery.data).length ? resultData(gallery.data) : galleryContent;

  const heroHeading = heroContent.heading || homeContent.hero.heading;
  const heroSubheading = heroContent.subheading || homeContent.hero.subheading;
  const heroEyebrow = heroContent.eyebrow || homeContent.hero.eyebrow;

  return (
    <>
      <section className="hero">
        <div className="hero__bg">
          {heroContent.image ? (
            <Img src={heroContent.image} alt="" ratio="auto" className="hero__img" />
          ) : (
            <div className="hero__img hero__img--plain" />
          )}
          <div className="hero__overlay" />
        </div>
        <div className="container hero__content">
          {heroEyebrow && <span className="eyebrow hero__eyebrow">{heroEyebrow}</span>}
          <h1>{heroHeading}</h1>
          <p>{heroSubheading}</p>
          <div className="hero__actions">
            <Link to="/admissions" className="btn btn--primary">
              Apply Today
            </Link>
            <Link to="/about" className="btn btn--light">
              Learn More
            </Link>
          </div>
        </div>
        {homeContent.stats[0] && (
          <div className="hero__float">
            <strong>{homeContent.stats[0].value}</strong>
            <span>{homeContent.stats[0].label}</span>
          </div>
        )}
      </section>

      <Stats page={page} />

      <WhyChooseUs />

      <PrincipalWelcome />

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">News</span>
            <h2 className="section-title">Featured Stories</h2>
            <p className="section-subtitle">Latest updates from across the school community.</p>
          </div>
          {home.loading || news.loading ? (
            <SkeletonGrid count={3} />
          ) : news.error ? (
            <ErrorState message={news.error} onRetry={news.refetch} />
          ) : newsItems.length ? (
            <>
              <div className="grid grid-3">
                {newsItems.slice(0, 3).map((n) => (
                  <NewsCard key={n.id} item={n} />
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: "28px" }}>
                <Link to="/news-events" className="btn btn--outline">
                  View all news
                </Link>
              </div>
            </>
          ) : (
            <Empty />
          )}
        </div>
      </Reveal>

      <Reveal as="section" className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Events</span>
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          {home.loading || events.loading ? (
            <SkeletonGrid count={3} />
          ) : events.error ? (
            <ErrorState message={events.error} onRetry={events.refetch} />
          ) : eventItems.length ? (
            <div className="grid grid-3">
              {eventItems.slice(0, 3).map((e) => (
                <EventCard key={e.id} item={e} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Reveal>

      <Testimonials items={resultData(testimonials.data)} />

      {gallery.loading ? (
        <Reveal as="section" className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Gallery</span>
              <h2 className="section-title">Campus Life</h2>
            </div>
            <SkeletonGrid count={6} ratio="4/3" />
          </div>
        </Reveal>
      ) : (
        galleryItems.length > 0 && (
          <Reveal as="section" className="section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Gallery</span>
                <h2 className="section-title">Campus Life</h2>
              </div>
              <div className="grid grid-3">
                {galleryItems.slice(0, 6).map((g) => (
                  <div key={g.id} className="card gallery-card">
                    <Img
                      src={g.imageUrl}
                      alt={g.title || "Campus"}
                      ratio="4/3"
                      fallback={g.title || "SVPM"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )
      )}
    </>
  );
}
