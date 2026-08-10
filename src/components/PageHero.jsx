import { Img } from "./ui.jsx";

export default function PageHero({ eyebrow, title, subtitle, image }) {
  return (
    <section className="page-hero">
      <div className="page-hero__bg">
        {image ? (
          <Img src={image} alt="" ratio="auto" className="page-hero__img" />
        ) : (
          <div className="page-hero__img page-hero__img--plain" />
        )}
      </div>
      <div className="container page-hero__content">
        {eyebrow && <span className="eyebrow page-hero__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
