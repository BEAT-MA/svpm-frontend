import { useEffect } from "react";

const SITE = {
  name: "Saint Vincent Pallotti School Masaka",
  url: "https://svpmasaka.rw",
  description:
    "A private Catholic day school in Masaka, Kicukiro District, Kigali offering exceptional early years, primary, and secondary education.",
  image: "/logo.png",
};

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en",
    publisher: { "@id": `${SITE.url}/#school` },
  };
}

function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel, href, extra = {}) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
}

function removeJsonLd(id) {
  document.head.querySelectorAll(`script[data-seo-id="${id}"]`).forEach((n) => n.remove());
}

function injectJsonLd(schemas) {
  if (!schemas.length) return;
  const id = "seo-jsonld";
  removeJsonLd(id);
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-seo-id", id);
  script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
  document.head.appendChild(script);
}

/**
 * Per-page SEO: title, description, keywords, Open Graph, Twitter card,
 * canonical URL and optional JSON-LD structured data.
 *
 * @param {{ title?: string, description?: string, keywords?: string,
 *           image?: string, type?: string, jsonLd?: object | object[],
 *           crumbs?: { name: string, url: string }[] }} options
 */
export function useSEO({
  title,
  description,
  keywords,
  image,
  type = "website",
  jsonLd,
  crumbs,
} = {}) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
  const crumbsKey = crumbs ? JSON.stringify(crumbs) : "";
  useEffect(() => {
    const base = title ? `${title} | ${SITE.name}` : SITE.name;
    document.title = base;
    setMeta("name", "description", description || SITE.description);
    if (keywords) setMeta("name", "keywords", keywords);
    setMeta(
      "name",
      "robots",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    setMeta("property", "og:site_name", SITE.name);
    setMeta("property", "og:title", base);
    setMeta("property", "og:description", description || SITE.description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", window.location.href);
    setMeta("property", "og:image", image || SITE.image);
    setMeta("property", "og:image:alt", base);
    setMeta("property", "og:locale", "en_RW");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", base);
    setMeta("name", "twitter:description", description || SITE.description);
    setMeta("name", "twitter:image", image || SITE.image);
    setMeta("name", "twitter:image:alt", base);

    setLink("canonical", window.location.href);

    const schemas = [];
    if (jsonLd) schemas.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));
    if (crumbs && crumbs.length) schemas.push(breadcrumbSchema(crumbs));
    injectJsonLd(schemas);

    return () => removeJsonLd("seo-jsonld");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, keywords, image, type, jsonLdKey, crumbsKey]);
}
