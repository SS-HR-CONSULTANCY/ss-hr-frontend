import { Button } from "../ui/button";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";


type Company = {
  id: string;
  name: string;
  logo: string; // logo URL
  tagline: string;
  trustScore: number; // 0-100
  since: number;
  industries: string[];
};

const MOCK_COMPANIES: Company[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `co-${i + 1}`,
  name: [
    "Google",
    "Microsoft",
    "Amazon",
    "Netflix",
    "Meta",
    "Stripe",
    "Shopify",
    "Airbnb",
    "Uber",
    "PayPal",
    "Adobe",
    "Salesforce",
    "Intel",
    "NVIDIA",
    "Atlassian",
    "Twilio",
    "Spotify",
    "Zoom",
    "DoorDash",
    "Datadog",
  ][i % 20] + (i > 19 ? ` ${Math.floor(i / 1)}` : ""),
  logo: `https://logo.clearbit.com/${[
    "google.com",
    "microsoft.com",
    "amazon.com",
    "netflix.com",
    "meta.com",
    "stripe.com",
    "shopify.com",
    "airbnb.com",
    "uber.com",
    "paypal.com",
    "adobe.com",
    "salesforce.com",
    "intel.com",
    "nvidia.com",
    "atlassian.com",
    "twilio.com",
    "spotify.com",
    "zoom.us",
    "doordash.com",
    "datadoghq.com",
  ][i % 20]}`,
  tagline: [
    "Trusted by teams worldwide",
    "Powering digital transformation",
    "Delivering value at scale",
    "Streaming innovation",
    "Connecting communities",
  ][i % 5],
  trustScore: 80 + (i % 21),
  since: 1998 + (i % 20),
  industries: [
    ["Cloud", "AI"],
    ["Ecommerce", "Logistics"],
    ["Fintech", "Payments"],
    ["Media", "Streaming"],
    ["DevTools", "SaaS"],
  ][i % 5],
}));

async function mockFetchCompanies(page: number, pageSize: number, q: string): Promise<Company[]> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 600));
  const start = page * pageSize;
  const end = start + pageSize;
  const filtered = q
    ? MOCK_COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.industries.some((x) => x.toLowerCase().includes(q.toLowerCase()))
    )
    : MOCK_COMPANIES;
  return filtered.slice(start, end);
}

// ------------------------------------------------------------
// UI Helpers
// ------------------------------------------------------------
const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
const TrsutedCompanies: React.FC = ({
  pageSize = 20,
  fetcher = mockFetchCompanies,
  className = "",
}: {
  pageSize?: number;
  fetcher?: (page: number, pageSize: number, q: string) => Promise<Company[]>;
  className?: string;
}) => {
  const [items, setItems] = useState<Company[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [qInput, setQInput] = useState("");

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(false);

  const load = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);
    try {
      const newItems = await fetcher(page, pageSize, query);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
      setPage((p) => p + 1);
    } catch (e: any) {
      setError(e?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, pageSize, query, hasMore, loading]);

  // Reset when query changes
  useEffect(() => {
    if (!mountedRef.current) return;
    setItems([]);
    setPage(0);
    setHasMore(true);
  }, [query]);

  // Observe the sentinel for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            load();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = useMemo(() => {
    const total = items.length;
    return total ? `Trusted by ${total}+ companies` : "Trusted Companies";
  }, [items.length]);

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl grid place-items-center font-bold">TC</div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="ext-sm">Scroll to discover more logos and brands</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search companies or industries"
              className="w-full md:w-80 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-black"
            />
            <Button
              variant={"outline"}
              onClick={() => setQuery(qInput)}
              className="rounded-xl px-4 py-2 hover:opacity-90 transition shadow"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="group rounded-2xl border p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition overflow-hidden"
            >
              <div className="flex flex-col justify-center items-center">
                <div className="size-12 rounded-xl grid place-items-center overflow-hidden">
                  <img src={c.logo} alt={c.name} className="w-10 h-10 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{c.name}</h3>
                  </div>
                  <p className="text-sm truncate">{c.tagline}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skel-${i}`}
                className={`rounded-2xl border p-4 shadow-sm h-36 ${shimmer}`}> 
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <p className="font-medium">{error}</p>
            <button
              onClick={load}
              className="mt-2 rounded-lg bg-red-600 text-white px-3 py-1.5 hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} className="h-10" />
      </div>

      <style>
        {`@keyframes shimmer { 100% { transform: translateX(100%); } }`}
      </style>
    </div>
  );
}

export default TrsutedCompanies;