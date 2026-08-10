import { useState } from "react";
import { api } from "../lib/api.js";
import { useFetch } from "../lib/hooks.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { NewsCard, EventCard } from "../components/cards.jsx";
import { Empty, ErrorState, SkeletonGrid } from "../components/ui.jsx";
import {
  news as newsContent,
  events as eventContent,
  calendar as calendarContent,
} from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

export default function NewsEvents() {
  const [page, setPage] = useState(1);
  const news = useFetch((opts) => api.list("news", `?page=${page}&limit=9`, opts), [page]);
  const events = useFetch((opts) => api.list("events", "?upcoming=true&limit=10", opts));
  const calendar = useFetch((opts) => api.list("calendar", "", opts));

  useSEO({
    title: "News & Events",
    description: "Stay up to date with news, upcoming events, and the academic calendar at SVPM.",
    crumbs: [
      { name: "Home", url: "https://svpmasaka.rw/" },
      { name: "News & Events", url: "https://svpmasaka.rw/news-events" },
    ],
  });

  const newsRes = news.data;
  const apiItems = resultData(newsRes);
  const items = apiItems.length ? apiItems : newsContent;
  const totalPages = apiItems.length ? newsRes?.totalPages || 1 : 1;
  const eventItems = resultData(events.data).length ? resultData(events.data) : eventContent;
  const calItems = resultData(calendar.data).length ? resultData(calendar.data) : calendarContent;

  return (
    <>
      <PageHero
        eyebrow="News & Events"
        title="News & Events"
        subtitle="Stay up to date with everything happening at SVPM."
      />

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">News</span>
            <h2 className="section-title">Latest News</h2>
          </div>
          {news.loading ? (
            <SkeletonGrid count={3} />
          ) : news.error ? (
            <ErrorState message={news.error} onRetry={news.refetch} />
          ) : items.length ? (
            <>
              <div className="grid grid-3">
                {items.map((n) => (
                  <NewsCard key={n.id} item={n} />
                ))}
              </div>
              <div className="pagination">
                <button
                  className="btn btn--outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn--outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
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
          {events.loading ? (
            <SkeletonGrid count={3} />
          ) : events.error ? (
            <ErrorState message={events.error} onRetry={events.refetch} />
          ) : eventItems.length ? (
            <div className="grid grid-3">
              {eventItems.map((e) => (
                <EventCard key={e.id} item={e} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Reveal>

      <Reveal as="section" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Calendar</span>
            <h2 className="section-title">Academic Calendar</h2>
          </div>
          {calendar.loading ? (
            <div className="grid grid-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: "24px" }}>
                  <div className="skeleton skeleton--line skeleton--line--sm" />
                  <div className="skeleton skeleton--line" style={{ margin: "8px 0" }} />
                  <div className="skeleton skeleton--line skeleton--line--md" />
                </div>
              ))}
            </div>
          ) : calendar.error ? (
            <ErrorState message={calendar.error} onRetry={calendar.refetch} />
          ) : calItems.length ? (
            <div className="calendar-list">
              {calItems.map((c) => (
                <div key={c.id} className="calendar-item">
                  <span className="calendar-item__term">{c.term}</span>
                  <span className="calendar-item__date">
                    {new Date(c.eventDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <strong>{c.title}</strong>
                  {c.description && <p>{c.description}</p>}
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
