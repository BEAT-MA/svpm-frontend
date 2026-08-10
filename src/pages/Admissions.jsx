import { useState } from "react";
import { api } from "../lib/api.js";
import { useFetch } from "../lib/hooks.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { Empty, ErrorState, SkeletonGrid } from "../components/ui.jsx";
import { admission as content, faqs as faqContent } from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

function FeeFlipCard({ level, flipped, onFlip }) {
  return (
    <button
      type="button"
      className={`flip-card${flipped ? " flip-card--flipped" : ""}`}
      onClick={onFlip}
      aria-expanded={flipped}
    >
      <div className="flip-card__inner">
        <div className="flip-card__face flip-card__front">
          <span className="flip-card__badge">{level.icon || "SVPM"}</span>
          <h3>{level.level}</h3>
          <p>{level.description}</p>
          <span className="flip-card__cta">View Fees →</span>
        </div>
        <div className="flip-card__face flip-card__back">
          <h3>{level.level} Fees</h3>
          <table className="table fee-table">
            <thead>
              <tr>
                <th>Fee</th>
                <th>Details</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {level.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.label}</td>
                  <td>{item.detail}</td>
                  <td className="fee-table__price">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flip-card__total">
            <span>TOTAL</span>
            <strong>{level.total}</strong>
          </div>
          <span className="btn btn--primary flip-card__apply">Apply Now</span>
        </div>
      </div>
    </button>
  );
}

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
const validPhone = (v) => /^[+\d][\d\s().-]{6,}$/.test(v?.trim() || "");

function validateTour(v) {
  const e = {};
  if (!v.parentName?.trim()) e.parentName = "Parent name is required.";
  if (!v.studentName?.trim()) e.studentName = "Student name is required.";
  if (!v.grade?.trim()) e.grade = "Grade is required.";
  if (!v.phone?.trim()) e.phone = "Phone is required.";
  else if (!validPhone(v.phone)) e.phone = "Enter a valid phone number.";
  if (!v.email?.trim()) e.email = "Email is required.";
  else if (!validEmail(v.email)) e.email = "Enter a valid email address.";
  if (!v.preferredDate) e.preferredDate = "Preferred date is required.";
  else if (new Date(v.preferredDate) < new Date(new Date().toDateString()))
    e.preferredDate = "Preferred date cannot be in the past.";
  return e;
}

function validateApp(v) {
  const e = {};
  if (!v.firstName?.trim()) e.firstName = "First name is required.";
  if (!v.lastName?.trim()) e.lastName = "Last name is required.";
  if (!v.dob) e.dob = "Date of birth is required.";
  else if (new Date(v.dob) > new Date()) e.dob = "Date of birth cannot be in the future.";
  if (!v.gender) e.gender = "Select a gender.";
  if (!v.grade?.trim()) e.grade = "Grade level is required.";
  if (!v.parentName?.trim()) e.parentName = "Parent name is required.";
  if (!v.parentId?.trim()) e.parentId = "National ID is required.";
  if (!v.email?.trim()) e.email = "Email is required.";
  else if (!validEmail(v.email)) e.email = "Enter a valid email address.";
  if (!v.phone?.trim()) e.phone = "Phone is required.";
  else if (!validPhone(v.phone)) e.phone = "Enter a valid phone number.";
  const files = [...(v.previousReport || []), ...(v.passportPhotos || [])];
  for (const f of files) {
    if (f.size > 5 * 1024 * 1024) {
      e.documents = "Each file must be 5 MB or smaller.";
      break;
    }
  }
  if (!v.consent) e.consent = "Please confirm the declaration to continue.";
  return e;
}

function useForm(initial, onSubmit, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const clearError = (name) =>
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  const handle = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    clearError(e.target.name);
  };
  const handleCheck = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.checked }));
    clearError(e.target.name);
  };
  const handleFile = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: Array.from(e.target.files || []) }));
    clearError(e.target.name);
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate ? validate(values) : {};
    setErrors(errs);
    if (Object.keys(errs).filter((k) => errs[k]).length > 0) {
      setStatus({ ok: false, msg: "Please fix the highlighted fields." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await onSubmit(values);
      setStatus({ ok: true, msg: "Submitted successfully. We'll be in touch soon!" });
      setValues(initial);
      setErrors({});
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setBusy(false);
    }
  };

  return { values, errors, handle, handleCheck, handleFile, submit, status, busy };
}

function Field({ label, error, name, className = "", ...rest }) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  return (
    <label className={`${error ? "has-error" : ""} ${className}`.trim()} htmlFor={fieldId}>
      {label}
      <input
        id={fieldId}
        name={name}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({ label, error, name, children, ...rest }) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  return (
    <label className={error ? "has-error" : ""} htmlFor={fieldId}>
      {label}
      <select
        id={fieldId}
        name={name}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {children}
      </select>
      {error && (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function TextareaField({ label, error, name, className = "", ...rest }) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  return (
    <label className={`${error ? "has-error" : ""} ${className}`.trim()} htmlFor={fieldId}>
      {label}
      <textarea
        id={fieldId}
        name={name}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

const tourInitial = {
  parentName: "",
  studentName: "",
  grade: "",
  phone: "",
  email: "",
  preferredDate: "",
  preferredTime: "10:00",
  notes: "",
};
const appInitial = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  grade: "",
  parentName: "",
  parentId: "",
  email: "",
  phone: "",
  previousSchool: "",
  previousReport: "",
  birthCert: "",
  passportPhotos: "",
  transferLetter: "",
  medicalRecord: "",
  consent: false,
};

export default function Admissions() {
  const fees = useFetch((opts) => api.list("tuition-fees", "", opts));
  const faqs = useFetch((opts) => api.list("faqs", "", opts));

  useSEO({
    title: "Admissions",
    description:
      "Admission process, required documents, tuition fees, and FAQs for Saint Vincent Pallotti School Masaka.",
    crumbs: [
      { name: "Home", url: "https://svpmasaka.rw/" },
      { name: "Admissions", url: "https://svpmasaka.rw/admissions" },
    ],
  });

  const apiFeeLevels = resultData(fees.data).length
    ? resultData(fees.data).map((f) => ({
        level: f.gradeLevel,
        annualTuition: f.annualTuition,
      }))
    : [];
  const feeLevels = content.fees.levels.map((lvl) => {
    const apiFee = apiFeeLevels.find((f) => f.level === lvl.level);
    return apiFee
      ? {
          ...lvl,
          items: lvl.items.map((item) =>
            item.label === "Tuition" && apiFee.annualTuition != null
              ? { ...item, price: `RWF ${Number(apiFee.annualTuition).toLocaleString()}` }
              : item
          ),
          total:
            apiFee.annualTuition != null
              ? `RWF ${Number(apiFee.annualTuition).toLocaleString()}`
              : lvl.total,
        }
      : lvl;
  });
  const [flipped, setFlipped] = useState({});
  const faqItems = resultData(faqs.data).length ? resultData(faqs.data) : faqContent;
  const [openFaq, setOpenFaq] = useState(null);

  const tour = useForm(tourInitial, (v) => api.submitTour(v), validateTour);

  const submitApp = async (values) => {
    const payload = new FormData();
    for (const [key, val] of Object.entries(values)) {
      if (Array.isArray(val)) {
        val.forEach((file) => payload.append(key, file));
      } else {
        payload.append(key, val);
      }
    }
    await api.submitApplication(payload);
  };
  const appForm = useForm(appInitial, submitApp, validateApp);

  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Join Our Community"
        subtitle="A simple, supportive admission process for every family."
      />

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Process</span>
            <h2 className="section-title">Admission Process</h2>
            <p className="section-subtitle">
              Six simple steps to join Saint Vincent Pallotti School Masaka.
            </p>
          </div>
          <div className="grid grid-3">
            {content.process.map((step, i) => (
              <div key={i} className="card" style={{ padding: "24px" }}>
                <span className="badge">Step {i + 1}</span>
                <h3>{step.title}</h3>
                <p style={{ margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Documents</span>
            <h2 className="section-title">Required Documents</h2>
          </div>
          <div className="grid grid-3">
            {content.documents.map((doc, i) => (
              <div key={i} className="card" style={{ padding: "20px 24px" }}>
                <strong>{doc}</strong>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Tuition</span>
            <h2 className="section-title">Tuition Fees</h2>
          </div>
          <p className="admissions-note">{content.fees.note}</p>
          {fees.loading ? (
            <SkeletonGrid count={3} />
          ) : fees.error ? (
            <ErrorState message={fees.error} onRetry={fees.refetch} />
          ) : (
            <div className="grid grid-3">
              {feeLevels.map((f, i) => (
                <FeeFlipCard
                  key={f.level}
                  level={f}
                  flipped={!!flipped[i]}
                  onFlip={() => setFlipped((s) => ({ ...s, [i]: !s[i] }))}
                />
              ))}
            </div>
          )}
          <p className="admissions-note" style={{ marginTop: "1.5rem", marginBottom: 0 }}>
            {content.fees.closingNote}
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="section section--muted">
        <div className="container">
          <div className="grid grid-2">
            <div className="card form-card">
              <div className="form-card__head">
                <h3>Book a Tour</h3>
                <p>Schedule a visit to our campus and see the school in person.</p>
              </div>
              <form onSubmit={tour.submit} noValidate>
                <div className="form-grid">
                  <Field
                    label="Parent Name"
                    name="parentName"
                    value={tour.values.parentName}
                    onChange={tour.handle}
                    error={tour.errors.parentName}
                    autoComplete="name"
                  />
                  <Field
                    label="Student Name"
                    name="studentName"
                    value={tour.values.studentName}
                    onChange={tour.handle}
                    error={tour.errors.studentName}
                  />
                  <Field
                    label="Grade"
                    name="grade"
                    value={tour.values.grade}
                    onChange={tour.handle}
                    error={tour.errors.grade}
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    value={tour.values.phone}
                    onChange={tour.handle}
                    error={tour.errors.phone}
                    type="tel"
                    autoComplete="tel"
                  />
                  <Field
                    label="Email"
                    name="email"
                    value={tour.values.email}
                    onChange={tour.handle}
                    error={tour.errors.email}
                    type="email"
                    autoComplete="email"
                  />
                  <Field
                    label="Preferred Date"
                    name="preferredDate"
                    value={tour.values.preferredDate}
                    onChange={tour.handle}
                    error={tour.errors.preferredDate}
                    type="date"
                  />
                  <SelectField
                    label="Preferred Time"
                    name="preferredTime"
                    value={tour.values.preferredTime}
                    onChange={tour.handle}
                  >
                    {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </SelectField>
                  <TextareaField
                    className="form-grid__full"
                    label="Notes"
                    name="notes"
                    value={tour.values.notes}
                    onChange={tour.handle}
                  />
                </div>
                <button className="btn btn--primary form-submit" disabled={tour.busy} type="submit">
                  {tour.busy ? "Sending…" : "Book Tour"}
                </button>
                {tour.status && (
                  <p
                    className={tour.status.ok ? "form-msg form-msg--ok" : "form-msg"}
                    role={tour.status.ok ? "status" : "alert"}
                  >
                    {tour.status.msg}
                  </p>
                )}
              </form>
            </div>

            <div className="card form-card">
              <div className="form-card__head">
                <h3>Submit an Application</h3>
                <p>
                  Complete all sections to apply for admission at Saint Vincent Pallotti School
                  Masaka.
                </p>
              </div>
              <form onSubmit={appForm.submit} noValidate>
                <fieldset className="form-section">
                  <legend>Student Information</legend>
                  <div className="form-grid">
                    <Field
                      label="First Name"
                      name="firstName"
                      value={appForm.values.firstName}
                      onChange={appForm.handle}
                      error={appForm.errors.firstName}
                      autoComplete="given-name"
                    />
                    <Field
                      label="Last Name"
                      name="lastName"
                      value={appForm.values.lastName}
                      onChange={appForm.handle}
                      error={appForm.errors.lastName}
                      autoComplete="family-name"
                    />
                    <Field
                      label="Date of Birth"
                      name="dob"
                      value={appForm.values.dob}
                      onChange={appForm.handle}
                      error={appForm.errors.dob}
                      type="date"
                    />
                    <SelectField
                      label="Gender"
                      name="gender"
                      value={appForm.values.gender}
                      onChange={appForm.handle}
                      error={appForm.errors.gender}
                    >
                      <option value="">Select</option>
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other</option>
                    </SelectField>
                    <Field
                      label="Grade Level"
                      name="grade"
                      value={appForm.values.grade}
                      onChange={appForm.handle}
                      error={appForm.errors.grade}
                      placeholder="e.g. Primary 4"
                    />
                  </div>
                </fieldset>

                <fieldset className="form-section">
                  <legend>Parent / Guardian Information</legend>
                  <div className="form-grid">
                    <Field
                      label="Full Name"
                      name="parentName"
                      value={appForm.values.parentName}
                      onChange={appForm.handle}
                      error={appForm.errors.parentName}
                      autoComplete="name"
                    />
                    <Field
                      label="National ID"
                      name="parentId"
                      value={appForm.values.parentId}
                      onChange={appForm.handle}
                      error={appForm.errors.parentId}
                      placeholder="ID number"
                    />
                    <Field
                      label="Email"
                      name="email"
                      value={appForm.values.email}
                      onChange={appForm.handle}
                      error={appForm.errors.email}
                      type="email"
                      autoComplete="email"
                    />
                    <Field
                      label="Phone"
                      name="phone"
                      value={appForm.values.phone}
                      onChange={appForm.handle}
                      error={appForm.errors.phone}
                      type="tel"
                      autoComplete="tel"
                      placeholder="e.g. +256 700 000 000"
                    />
                  </div>
                </fieldset>

                <fieldset className="form-section">
                  <legend>Academic History</legend>
                  <div className="form-grid">
                    <Field
                      label="Previous School"
                      name="previousSchool"
                      value={appForm.values.previousSchool}
                      onChange={appForm.handle}
                      placeholder="School name"
                    />
                    <Field
                      label="Previous Report Card"
                      name="previousReport"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={appForm.handleFile}
                      error={appForm.errors.documents}
                    />
                  </div>
                </fieldset>

                <fieldset className="form-section">
                  <legend>Required Documents</legend>
                  <div className="form-grid">
                    <Field
                      label="Birth Certificate No."
                      name="birthCert"
                      value={appForm.values.birthCert}
                      onChange={appForm.handle}
                    />
                    <Field
                      label="Passport Photos"
                      name="passportPhotos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={appForm.handleFile}
                      error={appForm.errors.documents}
                    />
                    <TextareaField
                      className="form-grid__full"
                      label="Transfer Letter"
                      name="transferLetter"
                      value={appForm.values.transferLetter}
                      onChange={appForm.handle}
                      placeholder="If applicable"
                    />
                  </div>
                </fieldset>

                <fieldset className="form-section">
                  <legend>Medical Information</legend>
                  <div className="form-grid">
                    <TextareaField
                      className="form-grid__full"
                      label="Medical Record"
                      name="medicalRecord"
                      value={appForm.values.medicalRecord}
                      onChange={appForm.handle}
                      placeholder="Allergies, conditions, or special needs"
                    />
                  </div>
                </fieldset>

                <label className={`form-consent ${appForm.errors.consent ? "has-error" : ""}`}>
                  <input
                    type="checkbox"
                    name="consent"
                    checked={appForm.values.consent}
                    onChange={appForm.handleCheck}
                    aria-invalid={appForm.errors.consent ? true : undefined}
                  />
                  <span>
                    I confirm that the information provided in this application is accurate and
                    complete, and I consent to Saint Vincent Pallotti School Masaka processing it
                    for admission purposes.
                  </span>
                  {appForm.errors.consent && (
                    <span className="field-error" role="alert">
                      {appForm.errors.consent}
                    </span>
                  )}
                </label>

                <button
                  className="btn btn--primary form-submit"
                  disabled={appForm.busy}
                  type="submit"
                >
                  {appForm.busy ? "Submitting…" : "Submit Application"}
                </button>
                {appForm.status && (
                  <p
                    className={appForm.status.ok ? "form-msg form-msg--ok" : "form-msg"}
                    role={appForm.status.ok ? "status" : "alert"}
                  >
                    {appForm.status.msg}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Contact</span>
            <h2 className="section-title">Admissions Office</h2>
          </div>
          <div className="grid grid-2">
            <div>
              <h4>Location</h4>
              <p style={{ whiteSpace: "pre-line", marginTop: 0 }}>{content.contact.location}</p>
              <h4>Phone</h4>
              <p style={{ marginTop: 0 }}>
                <a href={`tel:${content.contact.phone.replace(/\s/g, "")}`}>
                  {content.contact.phone}
                </a>
              </p>
              <h4>Email</h4>
              <p style={{ marginTop: 0 }}>
                <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
              </p>
            </div>
            <div>
              <h4>Office Hours</h4>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.contact.hours.map((h, i) => (
                      <tr key={i}>
                        <td>{h.day}</td>
                        <td>{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="admissions-help">
            <strong>Need Help?</strong>
            <span>{content.contact.helpText}</span>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section section--muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          {faqs.loading ? (
            <SkeletonGrid count={3} />
          ) : faqs.error ? (
            <ErrorState message={faqs.error} onRetry={faqs.refetch} />
          ) : faqItems.length ? (
            <div className="faq">
              {faqItems.map((f) => (
                <div
                  key={f.id}
                  className={`faq__item ${openFaq === f.id ? "faq__item--open" : ""}`}
                >
                  <button
                    className="faq__q"
                    onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                    aria-expanded={openFaq === f.id}
                  >
                    <span>{f.question}</span>
                    <span
                      className={`faq__chevron ${openFaq === f.id ? "faq__chevron--open" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div className={`faq__a-wrap ${openFaq === f.id ? "faq__a-wrap--open" : ""}`}>
                    <div className="faq__a">{f.answer}</div>
                  </div>
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
