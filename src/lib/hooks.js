import { useCallback, useEffect, useRef, useState } from "react";

export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? "0px 0px -48px 0px",
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

export function useCountUp(target, { duration = 1400, start = false } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * Number(target)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}

const DEFAULT_CACHE_MS = 60 * 1000;
const cacheStore = new Map();
const inflight = new Map();

function cacheKey(key) {
  return typeof key === "string" ? key : String(key);
}

function cachedValue(key) {
  const entry = cacheStore.get(key);
  if (!entry) return undefined;
  if (entry.expires < Date.now()) {
    cacheStore.delete(key);
    return undefined;
  }
  return entry.data;
}

function setCache(key, data, ttl) {
  cacheStore.set(key, { data, expires: Date.now() + ttl });
}

/**
 * Data fetching hook with in-memory caching, request deduplication,
 * automatic retries, abort-on-unmount and manual refetch.
 *
 * @param {() => Promise} fetcher - returns the fetch promise
 * @param {Array} deps - re-run when these change
 * @param {{ cacheTime?: number, retries?: number, key?: string }} options
 */
export function useFetch(fetcher, deps = [], options = {}) {
  const { cacheTime = DEFAULT_CACHE_MS, retries = 1, key } = options;
  const keyRef = useRef(key || fetcher.toString());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    keyRef.current = key || fetcherRef.current.toString();
  }, [key]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const k = cacheKey(keyRef.current);
    const cached = cachedValue(k);
    if (cached !== undefined) {
      setData(cached);
      setError(null);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let current = inflight.get(k);
    if (!current) {
      current = (async () => {
        let lastErr;
        const attempts = retries + 1;
        for (let i = 0; i < attempts; i += 1) {
          try {
            const res = await fetcherRef.current({ signal: controller.signal });
            setCache(k, res, cacheTime);
            return res;
          } catch (err) {
            lastErr = err;
            if (err?.name === "AbortError" || controller.signal.aborted) throw err;
            if (i === attempts - 1) throw err;
          }
        }
        throw lastErr;
      })();
      inflight.set(k, current);
      current.finally(() => inflight.delete(k)).catch(() => {});
    }

    current
      .then((res) => {
        if (!active) return;
        setData(res);
        setError(null);
      })
      .catch((e) => {
        if (!active) return;
        if (e?.name !== "AbortError" && !controller.signal.aborted) {
          setError(e.message || "Failed to load data");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick, cacheTime, retries, key]);

  const refetch = useCallback(() => {
    cacheStore.delete(cacheKey(keyRef.current));
    setTick((t) => t + 1);
  }, []);

  return { data, loading, error, refetch };
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function currency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}

export function truncate(str, len = 120) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len).trim() + "…" : str;
}
