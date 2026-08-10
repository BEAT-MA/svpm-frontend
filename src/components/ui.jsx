const RATIO_DIMS = {
  "1/1": { width: 400, height: 400 },
  "4/3": { width: 400, height: 300 },
  "16/9": { width: 400, height: 225 },
  "3/2": { width: 400, height: 267 },
};

function ratioDims(ratio) {
  return RATIO_DIMS[ratio] || null;
}

export function Img({
  src,
  alt = "",
  ratio = "16/9",
  className = "",
  fallback = "SVPM",
  loading = "lazy",
}) {
  const dims = ratioDims(ratio);
  const style = { aspectRatio: ratio, width: "100%", objectFit: "cover" };
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        width={dims?.width}
        height={dims?.height}
        loading={loading}
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          if (e.currentTarget.nextSibling) {
            e.currentTarget.nextSibling.style.display = "flex";
          }
        }}
      />
    );
  }
  return (
    <div className={`placeholder-img ${className}`} style={{ ...style, display: "flex" }}>
      <span>{fallback}</span>
    </div>
  );
}

export function Loading() {
  return (
    <div className="spinner" role="status">
      Loading…
    </div>
  );
}

export function Empty({ message = "No content available yet." }) {
  return <div className="empty">{message}</div>;
}

export function ErrorState({
  message = "We couldn't load this content. Please try again.",
  onRetry,
}) {
  return (
    <div className="empty error-state" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--outline" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" style={style} />;
}

export function SkeletonCard({ ratio = "16/9" }) {
  return (
    <div className="card skeleton-card">
      <Skeleton className="skeleton--block" style={{ aspectRatio: ratio }} />
      <Skeleton className="skeleton--line skeleton--line--sm" />
      <Skeleton className="skeleton--line" />
      <Skeleton className="skeleton--line skeleton--line--md" />
    </div>
  );
}

export function SkeletonGrid({ count = 3, ratio = "16/9" }) {
  return (
    <div className="grid grid-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} ratio={ratio} />
      ))}
    </div>
  );
}
