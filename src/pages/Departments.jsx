import { api } from "../lib/api.js";
import { useFetch } from "../lib/hooks.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { Img, Empty, ErrorState, SkeletonGrid } from "../components/ui.jsx";
import { departments as deptContent } from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

export default function Departments() {
  const departments = useFetch((opts) => api.list("departments", "?includeFaculty=true", opts));
  const spotlight = useFetch((opts) => api.list("faculty", "?spotlight=true", opts));

  useSEO({
    title: "Departments",
    description:
      "Explore the academic departments and faculty at Saint Vincent Pallotti School Masaka.",
    crumbs: [
      { name: "Home", url: "https://svpmasaka.rw/" },
      { name: "Departments", url: "https://svpmasaka.rw/departments" },
    ],
  });

  const deptItems = resultData(departments.data).length
    ? resultData(departments.data)
    : deptContent;
  const spotlightItems = resultData(spotlight.data);

  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Our Departments"
        subtitle="Explore the departments and faculty that shape our school."
      />

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Departments</span>
            <h2 className="section-title">Academic Departments</h2>
          </div>
          {departments.loading ? (
            <SkeletonGrid count={3} />
          ) : departments.error ? (
            <ErrorState message={departments.error} onRetry={departments.refetch} />
          ) : deptItems.length ? (
            <div className="grid grid-3">
              {deptItems.map((d) => (
                <div key={d.id} className="card dept-card" style={{ padding: "24px" }}>
                  <h3>{d.name}</h3>
                  {d.description && <p>{d.description}</p>}
                  {Array.isArray(d.faculty) && d.faculty.length > 0 && (
                    <div className="dept-card__faculty">
                      <strong>Faculty</strong>
                      <ul className="dept-card__list">
                        {d.faculty.map((f) => (
                          <li key={f.id}>
                            <strong>{f.name}</strong> — {f.role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Reveal>

      <Reveal as="section" className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Spotlight</span>
            <h2 className="section-title">Featured Faculty</h2>
          </div>
          {spotlight.loading ? (
            <SkeletonGrid count={4} ratio="1/1" />
          ) : spotlight.error ? (
            <ErrorState message={spotlight.error} onRetry={spotlight.refetch} />
          ) : spotlightItems.length ? (
            <div className="grid grid-4">
              {spotlightItems.map((f) => (
                <div key={f.id} className="card faculty-card">
                  <Img
                    src={f.imageUrl}
                    alt={f.name}
                    ratio="1/1"
                    className="faculty-card__img"
                    fallback={f.name?.charAt(0)}
                  />
                  <div className="faculty-card__body">
                    <h3>{f.name}</h3>
                    <span className="badge">{f.role}</span>
                    {f.department && <p>{f.department.name}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty message="Faculty profiles will be added soon." />
          )}
        </div>
      </Reveal>
    </>
  );
}
