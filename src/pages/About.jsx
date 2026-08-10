import { api } from "../lib/api.js";
import { useFetch } from "../lib/hooks.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { Img, Empty, ErrorState, SkeletonGrid } from "../components/ui.jsx";
import { about as content } from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

function Section({ section }) {
  if (!section) return null;
  const c = section.content || {};
  return (
    <Reveal as="section" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{section.subtitle || "Our Story"}</span>
          <h2 className="section-title">{section.title}</h2>
        </div>
        {c.body && (
          <p style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>{c.body}</p>
        )}
        {Array.isArray(c.items) && (
          <div className="grid grid-3" style={{ marginTop: "24px" }}>
            {c.items.map((it, i) => (
              <div key={i} className="card" style={{ padding: "24px" }}>
                <h3>{it.title}</h3>
                <p>{it.description || it.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function About() {
  const page = useFetch((opts) => api.getPage("about", opts));
  const leaders = useFetch((opts) => api.list("leadership", "", opts));

  useSEO({
    title: "About Us",
    description: "Who we are and what we value at Saint Vincent Pallotti School Masaka.",
    crumbs: [
      { name: "Home", url: "https://svpmasaka.rw/" },
      { name: "About Us", url: "https://svpmasaka.rw/about" },
    ],
  });

  const p = page.data;
  const hero = p?.sections?.find((s) => s.sectionKey === "hero_banner");
  const heroContent = hero?.content || {};
  const leaderItems = resultData(leaders.data);

  const apiSections = p?.sections?.filter((s) => s.sectionKey !== "hero_banner") || [];
  const sections = apiSections.length ? apiSections : content.sections;

  const heroHeading = heroContent.heading || "About Saint Vincent Pallotti School Masaka";
  const heroSubheading = heroContent.subheading || "Who we are and what we value.";

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={heroHeading}
        subtitle={heroSubheading}
        image={heroContent.image}
      />

      {page.loading ? (
        <SkeletonGrid count={3} />
      ) : page.error ? (
        <ErrorState message={page.error} onRetry={page.refetch} />
      ) : (
        sections.map((s) => <Section key={s.id || s.sectionKey} section={s} />)
      )}

      <Reveal as="section" className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Leadership</span>
            <h2 className="section-title">Meet Our Leaders</h2>
          </div>
          {leaders.loading ? (
            <SkeletonGrid count={4} ratio="1/1" />
          ) : leaders.error ? (
            <ErrorState message={leaders.error} onRetry={leaders.refetch} />
          ) : leaderItems.length ? (
            <div className="grid grid-4">
              {leaderItems.map((l) => (
                <div key={l.id} className="card leader-card">
                  <Img
                    src={l.imageUrl}
                    alt={l.fullName}
                    ratio="1/1"
                    className="leader-card__img"
                    fallback={l.fullName?.charAt(0)}
                  />
                  <div className="leader-card__body">
                    <h3>{l.fullName}</h3>
                    <span className="badge">{l.role}</span>
                    {l.bio && <p>{l.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty message="Leadership profiles will be added soon." />
          )}
        </div>
      </Reveal>
    </>
  );
}
