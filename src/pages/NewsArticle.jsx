import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import { useFetch } from "../lib/hooks.js";
import { useSEO } from "../lib/seo.js";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { Img, Skeleton } from "../components/ui.jsx";
import { news as newsContent } from "../data/content.js";

function resultData(res) {
  return res?.data || [];
}

export default function NewsArticle() {
  const { id } = useParams();
  const fetchRes = useFetch(
    (opts) => api.list("news", `?id=${encodeURIComponent(id)}`, opts),
    [id]
  );

  const localArticle = newsContent.find((n) => String(n.id) === String(id));
  const apiArticle = resultData(fetchRes.data)[0];
  const article = apiArticle || localArticle;
  const loading = fetchRes.loading && !localArticle;
  const notFound = !loading && !article;

  useSEO({
    title: article?.title || "News Article",
    description: article?.excerpt || "News and updates from Saint Vincent Pallotti School Masaka.",
    image: article?.imageUrl,
    type: "article",
    jsonLd: article
      ? [
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            description: article.excerpt || article.content,
            image: article.imageUrl || "/logo.png",
            datePublished: article.publishedAt || new Date().toISOString(),
            dateModified: article.updatedAt || article.publishedAt || new Date().toISOString(),
            author: { "@type": "Organization", name: "Saint Vincent Pallotti School Masaka" },
            publisher: {
              "@type": "Organization",
              name: "Saint Vincent Pallotti School Masaka",
              url: "https://svpmasaka.rw",
            },
            mainEntityOfPage: window.location.href,
          },
        ]
      : undefined,
    crumbs: article
      ? [
          { name: "Home", url: "https://svpmasaka.rw/" },
          { name: "News & Events", url: "https://svpmasaka.rw/news-events" },
          { name: article.title, url: window.location.href },
        ]
      : undefined,
  });

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <Skeleton className="skeleton--line skeleton--line--sm" />
          <Skeleton className="skeleton--line" style={{ height: "40px", margin: "16px 0" }} />
          <Skeleton className="skeleton--block" style={{ aspectRatio: "16/9" }} />
          <Skeleton className="skeleton--line" />
          <Skeleton className="skeleton--line" />
          <Skeleton className="skeleton--line skeleton--line--md" />
        </div>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="section">
        <div className="container not-found">
          <div>
            <span className="not-found__code">404</span>
            <h1>Article Not Found</h1>
            <p>Sorry, we couldn't find the news article you were looking for.</p>
            <Link to="/news-events" className="btn btn--primary">
              Back to News & Events
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={article.category || "News"}
        title={article.title}
        subtitle={
          article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : undefined
        }
        image={article.imageUrl}
      />

      <Reveal as="section" className="section">
        <div className="container">
          <div className="article">
            {article.imageUrl && (
              <Img
                src={article.imageUrl}
                alt={article.title}
                ratio="16/9"
                className="article__cover"
              />
            )}
            <div className="article__meta">
              {article.category && <span className="badge">{article.category}</span>}
              {article.publishedAt && (
                <span className="article__date">
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
            <div className="article__body">
              {(article.content || article.excerpt).split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <Link to="/news-events" className="btn btn--outline">
              ← Back to News & Events
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
