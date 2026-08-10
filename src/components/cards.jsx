import { Link } from "react-router-dom";
import { formatDate, truncate } from "../lib/hooks.js";
import { Img } from "./ui.jsx";

export function NewsCard({ item }) {
  return (
    <Link
      to={`/news-events/${item.id}`}
      className="card news-card news-card--link"
      aria-label={item.title}
    >
      <Img src={item.imageUrl} alt={item.title} ratio="16/9" fallback="News" />
      <div className="news-card__body">
        <div className="news-card__meta">
          {item.category && <span className="badge">{item.category}</span>}
          {item.publishedAt && (
            <span className="news-card__date">{formatDate(item.publishedAt)}</span>
          )}
        </div>
        <h3 className="news-card__title">{item.title}</h3>
        <p className="news-card__excerpt">{truncate(item.excerpt || item.content, 130)}</p>
      </div>
    </Link>
  );
}

export function EventCard({ item }) {
  return (
    <article className="card event-card">
      <div className="event-card__date">
        <span className="event-card__day">{new Date(item.eventDate).getUTCDate()}</span>
        <span className="event-card__month">
          {new Date(item.eventDate).toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>
      <div className="event-card__body">
        <h3 className="event-card__title">{item.title}</h3>
        {item.description && <p className="event-card__desc">{truncate(item.description, 90)}</p>}
        <div className="event-card__meta">
          <span>{item.category || "General"}</span>
          {item.location && <span>· {item.location}</span>}
        </div>
      </div>
    </article>
  );
}

export function NewsLink() {
  return (
    <Link to="/news-events" className="btn btn--outline">
      View all news & events
    </Link>
  );
}
