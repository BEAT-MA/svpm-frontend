import { api } from "../lib/api.js";
import { useFetch } from "../lib/hooks.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { Img, Empty, ErrorState, SkeletonGrid } from "../components/ui.jsx";
import {
  programs as programContent,
  departments as deptContent,
  subjects,
} from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

function SubjectsSection() {
  return (
    <Reveal as="section" className="section section--muted">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Subjects</span>
          <h2 className="section-title">Subjects We Teach</h2>
        </div>
        <div className="grid grid-2">
          <div className="card" style={{ padding: "28px" }}>
            <h3>Primary Subjects</h3>
            <div className="dept-card__names">
              {subjects.primary.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: "28px" }}>
            <h3>O-Level Subjects</h3>
            <div className="dept-card__names">
              {subjects.oLevel.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Academics() {
  const programs = useFetch((opts) => api.list("programs", "", opts));
  const departments = useFetch((opts) => api.list("departments", "?includeFaculty=true", opts));

  useSEO({
    title: "Academics",
    description:
      "Explore the academic programs and departments at Saint Vincent Pallotti School Masaka.",
    crumbs: [
      { name: "Home", url: "https://svpmasaka.rw/" },
      { name: "Academics", url: "https://svpmasaka.rw/academics" },
    ],
  });

  const programItems = resultData(programs.data).length
    ? resultData(programs.data)
    : programContent;
  const deptItems = resultData(departments.data).length
    ? resultData(departments.data)
    : deptContent;

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Academic Programs"
        subtitle="A curriculum designed to inspire lifelong learning at every stage."
      />

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Programs</span>
            <h2 className="section-title">Our Programs</h2>
          </div>
          {programs.loading ? (
            <SkeletonGrid count={3} />
          ) : programs.error ? (
            <ErrorState message={programs.error} onRetry={programs.refetch} />
          ) : programItems.length ? (
            <div className="grid grid-3">
              {programItems.map((p) => (
                <div key={p.id} className="card program-card">
                  <Img src={p.imageUrl} alt={p.title} ratio="16/9" fallback={p.title?.charAt(0)} />
                  <div className="program-card__body">
                    {p.ageRange && <span className="badge">{p.ageRange}</span>}
                    <h3>{p.title}</h3>
                    {p.description && <p>{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Reveal>

      <SubjectsSection />

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
                      <strong>Faculty: {d.faculty.length}</strong>
                      <div className="dept-card__names">
                        {d.faculty.slice(0, 4).map((f) => (
                          <span key={f.id}>{f.name}</span>
                        ))}
                      </div>
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
    </>
  );
}
