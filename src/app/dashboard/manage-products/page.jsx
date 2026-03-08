"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Eye, Search, X, Loader2,
  ShieldAlert, Package, Plus, ChevronLeft,
  ChevronRight, SlidersHorizontal, RefreshCw,
  Grid3X3, List
} from "lucide-react";
import toast from "react-hot-toast";

const LIMIT = 8;
const CATEGORIES = ["All", "Headphones", "Earbuds", "Speakers", "Power Banks", "Accessories"];

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="card overflow-hidden flex flex-col">
      {/* Fixed h-60 skeleton */}
      <div className="h-60 animate-pulse" style={{ background: "var(--bg-hover)" }} />
      <div className="p-3 sm:p-4 space-y-2.5">
        <div className="h-3 rounded animate-pulse w-16" style={{ background: "var(--bg-hover)" }} />
        <div className="h-4 rounded animate-pulse w-4/5" style={{ background: "var(--bg-hover)" }} />
        <div className="h-3 rounded animate-pulse w-full" style={{ background: "var(--bg-hover)" }} />
        <div className="h-3 rounded animate-pulse w-2/3" style={{ background: "var(--bg-hover)" }} />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 rounded animate-pulse w-14" style={{ background: "var(--bg-hover)" }} />
          <div className="h-7 rounded-lg animate-pulse w-16" style={{ background: "var(--bg-hover)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton table row ── */
function SkeletonTableRow({ cols }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      {/* # — md+ */}
      <td className="hidden md:table-cell text-center px-3 lg:px-4 py-3 lg:py-4 w-10">
        <div className="h-3 rounded animate-pulse w-5 mx-auto" style={{ background: "var(--bg-hover)" }} />
      </td>
      {/* Product */}
      <td className="px-3 sm:px-4 lg:px-5 py-3 lg:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl shrink-0 animate-pulse"
            style={{ background: "var(--bg-hover)" }} />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 rounded animate-pulse w-4/5" style={{ background: "var(--bg-hover)" }} />
            <div className="h-3 rounded animate-pulse w-2/5 sm:hidden" style={{ background: "var(--bg-hover)" }} />
          </div>
        </div>
      </td>
      {/* Category — sm+ */}
      <td className="hidden sm:table-cell px-3 sm:px-4 lg:px-5 py-3 lg:py-4">
        <div className="h-5 rounded-full animate-pulse w-20" style={{ background: "var(--bg-hover)" }} />
      </td>
      {/* Description — xl+ */}
      <td className="hidden xl:table-cell px-4 lg:px-5 py-4">
        <div className="space-y-1.5">
          <div className="h-3 rounded animate-pulse w-full" style={{ background: "var(--bg-hover)" }} />
          <div className="h-3 rounded animate-pulse w-2/3" style={{ background: "var(--bg-hover)" }} />
        </div>
      </td>
      {/* Price — sm+ */}
      <td className="hidden sm:table-cell px-3 sm:px-4 lg:px-5 py-3 lg:py-4">
        <div className="h-4 rounded animate-pulse w-14" style={{ background: "var(--bg-hover)" }} />
      </td>
      {/* Stock — lg+ */}
      <td className="hidden lg:table-cell px-3 sm:px-4 lg:px-5 py-3 lg:py-4">
        <div className="h-5 rounded-full animate-pulse w-16" style={{ background: "var(--bg-hover)" }} />
      </td>
      {/* Actions */}
      <td className="px-3 sm:px-4 lg:px-5 py-3 lg:py-4">
        <div className="flex gap-1.5">
          <div className="w-7 h-7 rounded-lg animate-pulse" style={{ background: "var(--bg-hover)" }} />
          <div className="w-7 h-7 rounded-lg animate-pulse" style={{ background: "var(--bg-hover)" }} />
        </div>
      </td>
    </tr>
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
export default function ManageProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState("default");
  const [category, setCategory] = useState("All");
  const [view,     setView]     = useState("grid");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    if (status === "authenticated") fetchProducts(1);
  }, [search, sort, category, status]);

  const handlePage = (pg) => {
    setPage(pg);
    fetchProducts(pg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res  = await fetch(`/api/products?id=${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Product deleted");
      setDeleteId(null);
      fetchProducts(page);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => { setCategory("All"); setSearch(""); setSort("default"); };
  const hasFilters   = category !== "All" || search || sort !== "default";

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "5rem" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen" style={{ paddingTop: "5rem" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ── Header ── */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                Manage Products
              </h1>
              <p className="text-sm sm:text-base" style={{ color: "var(--fg-muted)" }}>
                {total} products in your store ·{" "}
                <span style={{ color: "var(--accent)" }}>
                  <span className="hidden sm:inline">{session?.user?.email}</span>
                  <span className="sm:hidden">{session?.user?.email?.split("@")[0]}</span>
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => fetchProducts(page)} title="Refresh"
                className="p-2 sm:p-2.5 rounded-xl transition-all hover:scale-105"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
                <RefreshCw className="w-7 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <Link href="/dashboard/add-product" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="w-full inline">Add Product</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-6 sm:mb-8">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4"
              style={{ color: "var(--fg-subtle)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-9 sm:pl-10 pr-9 sm:pr-10 w-full text-sm" />
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
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "var(--font-display)" }}>
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
          {total} product{total !== 1 ? "s" : ""} found
          {category !== "All" && ` in "${category}"`}
          {search && ` matching "${search}"`}
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

                  {/* ── Image — fixed h-60 on all breakpoints ── */}
                  <div className="relative h-40 sm:h-60 overflow-hidden"
                    style={{ background: "var(--bg-hover)" }}>
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {p.badge && (
                      <span className="badge badge-blue absolute top-2 left-2 text-xs">{p.badge}</span>
                    )}
                    {/* {!p.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(8,12,20,0.75)" }}>
                        <span className="badge badge-red text-xs">Out of Stock</span>
                      </div>
                    )} */}
                  </div>

                  {/* ── Body ── */}
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
                    <div className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2 gap-1">
                      <span className="price-tag text-sm sm:text-base">${p.price}</span>
                      <div className="flex items-center gap-1">
                        <Link href={`/products/${p._id}`}
                          className="p-1.5 sm:p-2 rounded-lg transition-all hover:scale-110"
                          style={{ background: "var(--bg-hover)", color: "var(--primary)" }}>
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                        <button onClick={() => setDeleteId(p._id)}
                          className="p-1.5 sm:p-2 rounded-lg transition-all hover:scale-110"
                          style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}>
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        )}

        {/* ══════════════════════════════
            LIST VIEW — responsive table
            Mobile  : #(hidden) | Product(img+name+cat+price) | Actions
            Tablet  : # (hidden)| Product(img+name) | Category | Price | Actions
            Laptop  : # | Product | Category | Price | Stock | Actions
            Desktop : # | Product | Category | Description | Price | Stock | Actions
        ══════════════════════════════ */}
        {view === "list" && (loading || products.length > 0) && (
          <div className="rounded-xl sm:rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 320 }}>

                {/* ─── HEAD ─── */}
                <thead>
                  <tr style={{ background: "var(--bg-hover)", borderBottom: "2px solid var(--border)" }}>

                    {/* # — lg+ */}
                    <th className="hidden lg:table-cell text-center px-3 lg:px-4 py-3 lg:py-3.5 text-xs font-bold uppercase tracking-widest w-10"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>#</th>

                    {/* Product — always */}
                    <th className="text-left px-3 sm:px-4 lg:px-5 py-3 lg:py-3.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                      Product
                    </th>

                    {/* Category — sm+ */}
                    <th className="hidden sm:table-cell text-left px-3 sm:px-4 lg:px-5 py-3 lg:py-3.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                      Category
                    </th>

                    {/* Description — xl+ */}
                    <th className="hidden xl:table-cell text-left px-4 lg:px-5 py-3.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                      Description
                    </th>

                    {/* Price — sm+ (mobile shows under name) */}
                    <th className="hidden sm:table-cell text-left px-3 sm:px-4 lg:px-5 py-3 lg:py-3.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                      Price
                    </th>

                    {/* Stock — lg+ */}
                    {/* <th className="hidden lg:table-cell text-left px-3 sm:px-4 lg:px-5 py-3 lg:py-3.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                      Stock
                    </th> */}

                    {/* Actions — always */}
                    <th className="text-left px-3 sm:px-4 lg:px-5 py-3 lg:py-3.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* ─── BODY ─── */}
                <tbody>
                  {loading
                    ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonTableRow key={i} />)
                    : (
                      <AnimatePresence>
                        {products.map((p, i) => (
                          <motion.tr key={p._id}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ delay: i * 0.03 }}
                            className="group transition-colors"
                            style={{
                              borderBottom: i < products.length - 1 ? "1px solid var(--border)" : "none",
                              background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg)",
                            }}>

                            {/* # serial — lg+ */}
                            <td className="hidden lg:table-cell text-center px-3 lg:px-4 py-2.5 lg:py-3.5 w-10">
                              <span className="text-xs font-bold"
                                style={{ color: "var(--fg-subtle)", fontFamily: "var(--font-mono)" }}>
                                {(page - 1) * LIMIT + i + 1}
                              </span>
                            </td>

                            {/* Product — image + name + sub info stacked by breakpoint */}
                            <td className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-3.5">
                              <div className="flex items-center gap-2 sm:gap-3">
                                {/* Thumbnail scales with screen */}
                                <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-13 lg:h-13 rounded-lg sm:rounded-xl overflow-hidden shrink-0"
                                  style={{ background: "var(--bg-hover)" }}>
                                  <img src={p.imageUrl} alt={p.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold line-clamp-1 leading-snug"
                                    style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                                    {p.title}
                                  </p>
                                  {/* Category — mobile only (sub-line) */}
                                  <p className="sm:hidden text-xs mt-0.5 truncate font-mono"
                                    style={{ color: "var(--accent)" }}>
                                    {p.category}
                                  </p>
                                  {/* Price — mobile only (sub-line) */}
                                  <p className="sm:hidden text-xs mt-0.5 font-bold"
                                    style={{ color: "var(--fg)" }}>
                                    ${p.price}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category badge — sm+ */}
                            <td className="hidden sm:table-cell px-3 sm:px-4 lg:px-5 py-2.5 lg:py-3.5">
                              <span className="badge badge-cyan" style={{ fontSize: "0.65rem" }}>
                                {p.category}
                              </span>
                            </td>

                            {/* Description — xl+ */}
                            <td className="hidden xl:table-cell px-4 lg:px-5 py-3.5" style={{ maxWidth: 220 }}>
                              <p className="text-xs line-clamp-2 leading-relaxed"
                                style={{ color: "var(--fg-muted)" }}>
                                {p.shortDescription || "—"}
                              </p>
                            </td>

                            {/* Price — sm+ */}
                            <td className="hidden sm:table-cell px-3 sm:px-4 lg:px-5 py-2.5 lg:py-3.5 whitespace-nowrap">
                              <span className="price-tag text-sm lg:text-base">${p.price}</span>
                            </td>

                            {/* Stock — lg+ */}
                            {/* <td className="hidden lg:table-cell px-3 sm:px-4 lg:px-5 py-2.5 lg:py-3.5">
                              <span className={`badge text-xs ${p.inStock ? "badge-green" : "badge-red"}`}>
                                {p.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                            </td> */}

                            {/* Actions — always */}
                            <td className="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3.5">
                              <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                                <Link href={`/products/${p._id}`} title="View"
                                  className="p-1.5 sm:p-2 rounded-lg transition-all hover:scale-110"
                                  style={{ background: "var(--bg-hover)", color: "var(--primary)" }}>
                                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                                </Link>
                                <button onClick={() => setDeleteId(p._id)} title="Delete"
                                  className="p-1.5 sm:p-2 rounded-lg transition-all hover:scale-110"
                                  style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}>
                                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                                </button>
                              </div>
                            </td>

                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )
                  }
                </tbody>
              </table>
            </div>

            {/* Empty */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12 sm:py-16" style={{ background: "var(--bg-card)" }}>
                <Package className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3"
                  style={{ color: "var(--fg-subtle)" }} />
                <p className="font-semibold text-sm sm:text-base mb-1" style={{ color: "var(--fg)" }}>No products found</p>
                <p className="text-xs sm:text-sm" style={{ color: "var(--fg-muted)" }}>
                  {search ? `No results for "${search}"` : `No products in "${category}"`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && <Pagination page={page} pages={pages} onPage={handlePage} />}

        {/* ── Delete modal ── */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => !deleting && setDeleteId(null)}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }}
                onClick={e => e.stopPropagation()}
                className="relative z-10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-xs sm:max-w-sm w-full text-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ background: "rgba(239,68,68,0.1)" }}>
                  <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: "var(--danger)" }} />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold mb-1.5 sm:mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                  Delete Product?
                </h3>
                <p className="text-xs sm:text-sm mb-5 sm:mb-6" style={{ color: "var(--fg-muted)" }}>
                  This action cannot be undone. The product will be permanently removed from the database.
                </p>
                <div className="flex gap-2 sm:gap-3">
                  <button onClick={() => setDeleteId(null)} disabled={deleting}
                    className="btn-outline flex-1 justify-center py-2 sm:py-2.5 text-xs sm:text-sm disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-60"
                    style={{ background: "var(--danger)", color: "white", fontFamily: "var(--font-display)" }}>
                    {deleting
                      ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> Deleting...</>
                      : <><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Delete</>
                    }
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}