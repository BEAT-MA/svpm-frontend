import { api } from "../lib/api.js";
import { useFetch } from "../lib/hooks.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Reveal from "../components/Reveal.jsx";
import { Img, ErrorState, SkeletonGrid } from "../components/ui.jsx";
import {
  studentLife as content,
  gallery as galleryContent,
  galleryCategories,
} from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

function GallerySection({ category }) {
  const gallery = useFetch((opts) => api.list("gallery", `?category=${category}&limit=6`, opts));
  const apiItems = resultData(gallery.data);
  const items = apiItems.length ? apiItems : galleryContent.filter((g) => g.category === category);
  if (gallery.loading) return <SkeletonGrid count={3} ratio="4/3" />;
  if (gallery.error) return <ErrorState message={gallery.error} onRetry={gallery.refetch} />;
  if (items.length === 0) return null;
  return (
    <Reveal as="section" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{category}</span>
          <h2 className="section-title" style={{ textTransform: "capitalize" }}>
            {category} Gallery
          </h2>
        </div>
        <div className="grid grid-3">
          {items.map((g) => (
            <div key={g.id} className="card">
              <Img
                src={g.imageUrl}
                alt={g.title || category}
                ratio="4/3"
                fallback={g.title || category}
              />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function StudentLife() {
  const page = useFetch((opts) => api.getPage("student-life", opts));
  const testimonials = useFetch((opts) => api.list("testimonials", "", opts));

  useSEO({
    title: "Student Life",
    description: "Clubs, sports, arts, and campus life at Saint Vincent Pallotti School Masaka.",
    crumbs: [
      { name: "Home", url: "https://svpmasaka.rw/" },
      { name: "Student Life", url: "https://svpmasaka.rw/student-life" },
    ],
  });

  const p = page.data;
  const hero = p?.sections?.find((s) => s.sectionKey === "hero_banner");
  const heroContent = hero?.content || {};

  const apiSections =
    p?.sections?.filter((s) => !["hero_banner", "testimonials"].includes(s.sectionKey)) || [];
  const sections = apiSections.length ? apiSections : content.sections;

  return (
    <>
      <PageHero
        eyebrow="Student Life"
        title={heroContent.heading || content.hero.heading}
        subtitle={heroContent.subheading || content.hero.subheading}
        image={heroContent.image}
      />

      {page.loading ? (
        <SkeletonGrid count={3} />
      ) : page.error ? (
        <ErrorState message={page.error} onRetry={page.refetch} />
      ) : (
        sections.map((s) => {
          const c = s.content || {};
          return (
            <Reveal key={s.id || s.sectionKey} as="section" className="section">
              <div className="container">
                <div className="section-head">
                  <span className="eyebrow">{s.subtitle || "Student Life"}</span>
                  <h2 className="section-title">{s.title}</h2>
                </div>
                {c.body && (
                  <p style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
                    {c.body}
                  </p>
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
        })
      )}

      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Galleries</span>
            <h2 className="section-title">Photos</h2>
          </div>
          {galleryCategories.map((cat) => (
            <section key={cat}>
              <GallerySection category={cat} />
            </section>
          ))}
        </div>
      </section>

      <Testimonials items={resultData(testimonials.data)} />
    </>
  );
}
