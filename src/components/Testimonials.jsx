import { useState } from "react";
import { Img } from "./ui.jsx";

export default function Testimonials({ items }) {
  const [index, setIndex] = useState(0);
  if (!items || items.length === 0) return null;
  const current = items[index % items.length];

  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow" style={{ color: "#9db8d6" }}>
            Testimonials
          </span>
          <h2 className="section-title">What Our Community Says</h2>
        </div>
        <div className="testimonial" aria-live="polite">
          <div className="testimonial__quote">“{current.quote}”</div>
          <div className="testimonial__author">
            <Img
              src={current.photo}
              alt={current.name}
              ratio="1/1"
              className="testimonial__photo"
              fallback="•"
            />
            <div>
              <strong>{current.name}</strong>
              <span>{current.role}</span>
            </div>
          </div>
          {items.length > 1 && (
            <div className="testimonial__nav">
              <button
                onClick={() => setIndex((index - 1 + items.length) % items.length)}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button
                onClick={() => setIndex((index + 1) % items.length)}
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
