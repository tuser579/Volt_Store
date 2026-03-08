"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, Star,
  Grid3X3, List, X, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import toast from "react-hot-toast";

const LIMIT = 12;
const CATEGORIES = ["All", "Headphones", "Earbuds", "Speakers", "Power Banks", "Accessories"];

/* ── Stars ── */
const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < n ? "fill-current" : "opacity-25"}`}
        style={{ color: "var(--warning)" }} />
    ))}
  </div>
);

const badgeMap = {
  warning: "badge-amber", cyan: "badge-cyan", green: "badge-green",
  red: "badge-red", blue: "badge-blue",
};

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="h-40 sm:h-60 animate-pulse" style={{ background: "var(--bg-hover)" }} />
      <div className="p-3 sm:p-4 space-y-2.5">
        <div className="h-3 rounded animate-pulse w-16" style={{ background: "var(--bg-hover)" }} />
        <div className="h-4 rounded animate-pulse w-4/5" style={{ background: "var(--bg-hover)" }} />
        <div className="h-3 rounded animate-pulse w-full" style={{ background: "var(--bg-hover)" }} />
        <div className="h-3 rounded animate-pulse w-2/3" style={{ background: "var(--bg-hover)" }} />
        <div className="flex gap-0.5 py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full animate-pulse" style={{ background: "var(--bg-hover)" }} />
          ))}
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 rounded animate-pulse w-14" style={{ background: "var(--bg-hover)" }} />
          <div className="h-7 rounded-lg animate-pulse w-16" style={{ background: "var(--bg-hover)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton list row ── */
function SkeletonListRow() {
  return (
    <div className="card p-3 sm:p-4 flex gap-3 sm:gap-4">
      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl animate-pulse shrink-0"
        style={{ background: "var(--bg-hover)" }} />
      <div className="flex-1 space-y-2 sm:space-y-2.5 pt-1">
        <div className="h-3 rounded animate-pulse w-20" style={{ background: "var(--bg-hover)" }} />
        <div className="h-5 rounded animate-pulse w-3/4" style={{ background: "var(--bg-hover)" }} />
        <div className="h-3 rounded animate-pulse w-full hidden sm:block" style={{ background: "var(--bg-hover)" }} />
        <div className="h-3 rounded animate-pulse w-2/3 hidden sm:block" style={{ background: "var(--bg-hover)" }} />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 rounded animate-pulse w-14" style={{ background: "var(--bg-hover)" }} />
          <div className="h-8 rounded-lg animate-pulse w-20" style={{ background: "var(--bg-hover)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ── */
function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const getPages = () => {
    const arr = [];
    if (pages <= 7) { for (let i = 1; i <= pages; i++) arr.push(i); }
    else {
      arr.push(1);
      if (page > 3) arr.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) arr.push(i);
      if (page < pages - 2) arr.push("...");
      arr.push(pages);
    }
    return arr;
  };
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 gap-3">
      <p className="text-xs sm:text-sm order-2 sm:order-1"
        style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
        Page {page} of {pages}
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
        <button onClick={() => onPage(page - 1)} disabled={page === 1}
          className="p-1.5 sm:p-2 rounded-lg transition-all disabled:opacity-30"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}>
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`d${i}`} className="px-1.5 text-sm" style={{ color: "var(--fg-muted)" }}>…</span>
          ) : (
            <button key={p} onClick={() => onPage(p)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-all"
              style={{
                background: page === p ? "var(--primary)" : "var(--bg-card)",
                color:      page === p ? "white"           : "var(--fg)",
                border:     `1px solid ${page === p ? "var(--primary)" : "var(--border)"}`,
                fontFamily: "var(--font-mono)",
              }}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPage(page + 1)} disabled={page === pages}
          className="p-1.5 sm:p-2 rounded-lg transition-all disabled:opacity-30"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════ */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [sort,     setSort]     = useState("default");
  const [view,     setView]     = useState("grid");

  const fetchProducts = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pg, limit: LIMIT, search, sort,
        category: category === "All" ? "" : category,
      });
      const res  = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setProducts(data.products);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, sort, category]);

  useEffect(() => { fetchProducts(1); }, [search, sort, category]);

  const handlePage = (pg) => {
    setPage(pg);
    fetchProducts(pg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => { setSearch(""); setCategory("All"); setSort("default"); };
  const hasFilters   = category !== "All" || search || sort !== "default";

  return (
    <div className="page-enter min-h-screen" style={{ paddingTop: "5rem" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 lg:py-15">

        {/* ── Header ── */}
        <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col items-center">
          <span className="badge badge-blue mb-2 sm:mb-3">All Products</span>
          <h1 className="text-center text-3xl sm:text-5xl font-extrabold mb-1 sm:mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
            Premium Electronics
          </h1>
          <p className="text-center text-sm sm:text-base" style={{ color: "var(--fg-muted)" }}>
            {loading
              ? "Loading products..."
              : `Discover ${total} curated products. Sound gear you'll love.`
            }
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-6 sm:mb-8">

          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4"
              style={{ color: "var(--fg-subtle)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-9 sm:pl-10 pr-9 sm:pr-10 w-full text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--fg-subtle)" }}>
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  fontFamily: "var(--font-display)",
                  background: category === c ? "var(--primary)" : "var(--bg-card)",
                  color:      category === c ? "white"           : "var(--fg-muted)",
                  border:     `1px solid ${category === c ? "var(--primary)" : "var(--border)"}`,
                  boxShadow:  category === c ? "0 0 10px var(--primary-glow)" : "none",
                }}>
                {c}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                style={{
                  background: "rgba(239,68,68,0.1)", color: "var(--danger)",
                  border: "1px solid rgba(239,68,68,0.2)", fontFamily: "var(--font-display)",
                }}>
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* Sort + view toggle */}
          <div className="flex items-center gap-2 lg:ml-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: "var(--fg-muted)" }} />
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="input-field text-xs py-1.5 sm:py-2 flex-1 sm:w-auto"
              style={{ background: "var(--bg-card)" }}>
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
            <div className="flex rounded-lg overflow-hidden shrink-0" style={{ border: "1px solid var(--border)" }}>
              {[["grid", Grid3X3], ["list", List]].map(([v, Icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className="p-1.5 sm:p-2 transition-all"
                  style={{
                    background: view === v ? "var(--primary)" : "var(--bg-card)",
                    color:      view === v ? "white"           : "var(--fg-muted)",
                  }}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results count ── */}
        <p className="text-xs sm:text-sm mb-4 sm:mb-6"
          style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--primary)" }} />
              Fetching products…
            </span>
          ) : (
            <>
              {total} product{total !== 1 ? "s" : ""} found
              {category !== "All" && ` in "${category}"`}
              {search && ` matching "${search}"`}
            </>
          )}
        </p>

        {/* ══ EMPTY STATE ══ */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔍</p>
            <p className="text-base sm:text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              No products found
            </p>
            <p className="text-xs sm:text-sm mb-4" style={{ color: "var(--fg-muted)" }}>
              Try a different search or category
            </p>
            <button onClick={clearFilters} className="btn-outline text-sm px-4 py-2">
              Clear filters
            </button>
          </div>
        )}

        {/* ══════════════════════════════
            GRID VIEW
        ══════════════════════════════ */}
        {view === "grid" && (loading || products.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {loading
              ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
              : products.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="card group overflow-hidden flex flex-col">

                  {/* Image — h-40 mobile / h-60 sm+ */}
                  <div className="relative h-40 sm:h-60 overflow-hidden"
                    style={{ background: "var(--bg-hover)" }}>
                    <img src={p.imageUrl} alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {p.badge && (
                      <span className={`badge absolute top-2 left-2 text-xs ${badgeMap[p.badgeType] ?? "badge-blue"}`}>
                        {p.badge}
                      </span>
                    )}
                    {/* {!p.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(8,12,20,0.75)" }}>
                        <span className="badge badge-red text-xs">Out of Stock</span>
                      </div>
                    )} */}
                  </div>

                  {/* Body */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <p className="text-xs font-mono mb-0.5 sm:mb-1 truncate"
                      style={{ color: "var(--accent)" }}>
                      {p.category}
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold mb-1 line-clamp-2 leading-snug"
                      style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                      {p.title}
                    </h3>
                    {p.shortDescription && (
                      <p className="text-xs mb-2 sm:mb-3 line-clamp-2 flex-1 hidden sm:block"
                        style={{ color: "var(--fg-muted)", lineHeight: 1.5 }}>
                        {p.shortDescription}
                      </p>
                    )}
                    {(p.rating || p.reviews) && (
                      <div className="items-center gap-1.5 mb-2 hidden sm:flex">
                        <Stars n={Math.round(p.rating)} />
                        <span className="text-xs font-mono" style={{ color: "var(--fg-subtle)" }}>
                          {p.rating} ({p.reviews})
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2 gap-1">
                      <div>
                        <span className="price-tag text-sm sm:text-base">${p.price}</span>
                        {p.originalPrice && (
                          <span className="text-xs line-through ml-1.5 hidden sm:inline"
                            style={{ color: "var(--fg-subtle)" }}>
                            ${p.originalPrice}
                          </span>
                        )}
                      </div>
                      <Link href={`/products/${p._id}`}
                        className="btn-primary text-xs px-2.5 sm:px-5 py-1.5 rounded-xl">
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        )}

        {/* ══════════════════════════════
            LIST VIEW
        ══════════════════════════════ */}
        {view === "list" && (loading || products.length > 0) && (
          <div className="flex flex-col gap-3 sm:gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonListRow key={i} />)
              : products.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="card p-3 sm:p-4 flex gap-3 sm:gap-4 group">

                  {/* Thumbnail — smaller on mobile */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg sm:rounded-xl overflow-hidden shrink-0"
                    style={{ background: "var(--bg-hover)" }}>
                    <img src={p.imageUrl} alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <div className="min-w-0">
                        <p className="text-xs font-mono mb-0.5 truncate" style={{ color: "var(--accent)" }}>
                          {p.category}
                        </p>
                        <h3 className="text-sm sm:text-base font-bold leading-snug line-clamp-1"
                          style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                          {p.title}
                        </h3>
                      </div>
                      {p.badge && (
                        <span className={`badge text-xs shrink-0 ${badgeMap[p.badgeType] ?? "badge-blue"}`}>
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {p.shortDescription && (
                      <p className="text-xs sm:text-sm mb-2 line-clamp-2 hidden sm:block"
                        style={{ color: "var(--fg-muted)" }}>
                        {p.shortDescription}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mt-1.5 sm:mt-0">
                      {(p.rating || p.reviews) && (
                        <div className="items-center gap-1.5 hidden sm:flex">
                          <Stars n={Math.round(p.rating)} />
                          <span className="text-xs font-mono" style={{ color: "var(--fg-subtle)" }}>
                            {p.rating} ({p.reviews})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                        <div>
                          <span className="price-tag text-sm sm:text-lg">${p.price}</span>
                          {p.originalPrice && (
                            <span className="text-xs line-through ml-1.5 hidden sm:inline"
                              style={{ color: "var(--fg-subtle)" }}>
                              ${p.originalPrice}
                            </span>
                          )}
                        </div>
                        <Link href={`/products/${p._id}`}
                          className="btn-primary text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && <Pagination page={page} pages={pages} onPage={handlePage} />}

      </div>
    </div>
  );
}