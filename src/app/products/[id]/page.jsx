"use client";

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, ShoppingCart, Heart, Share2,
  CheckCircle, XCircle, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import Link from "next/link";

/* ── Stars ── */
const Stars = ({ n, size = "w-4 h-4" }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${size} ${i < n ? "fill-current" : "opacity-25"}`}
        style={{ color: "var(--warning)" }} />
    ))}
  </div>
);

const badgeMap = {
  warning: "badge-amber", cyan: "badge-cyan",
  green: "badge-green",   red:  "badge-red", blue: "badge-blue",
};

/* ── Skeleton ── */
function ProductSkeleton() {
  return (
    <div className="min-h-screen" style={{ paddingTop: "5rem" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="h-5 w-16 rounded animate-pulse mb-6 sm:mb-8" style={{ background: "var(--bg-hover)" }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div className="aspect-square rounded-2xl sm:rounded-3xl animate-pulse" style={{ background: "var(--bg-hover)" }} />
          <div className="space-y-4">
            {[40, 200, 100, 60, 300, 120].map((w, i) => (
              <div key={i} className="h-5 rounded animate-pulse" style={{ width: w, background: "var(--bg-hover)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Related card ── */
function RelatedCard({ p }) {
  return (
    <Link href={`/products/${p._id}`} className="card group overflow-hidden block">
      <div className="aspect-square overflow-hidden" style={{ background: "var(--bg-hover)" }}>
        <img src={p.imageUrl} alt={p.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-2.5 sm:p-3">
        <p className="text-xs font-bold truncate mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>{p.title}</p>
        <p className="price-tag text-sm">${p.price}</p>
      </div>
    </Link>
  );
}

/* ════════════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
════════════════════════════════════════════════════════ */
export default function ProductDetailPage({ params }) {
  const { id }   = use(params);
  const router   = useRouter();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);   // for multi-image support
  const [wished,   setWished]   = useState(false);
  const [copied,   setCopied]   = useState(false);

  /* ── Fetch product by ID ── */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res  = await fetch(`/api/products/${id}`);
        if (res.status === 404) { notFound(); return; }
        const data = await res.json();
        if (data.error) { notFound(); return; }
        setProduct(data.product);

        /* fetch related — same category */
        if (data.product?.category) {
          const r = await fetch(
            `/api/products?limit=4&category=${encodeURIComponent(data.product.category)}`
          );
          const rd = await r.json();
          setRelated((rd.products || []).filter(p => p._id !== id).slice(0, 4));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* Share */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (loading) return <ProductSkeleton />;
  if (!product) return notFound();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  /* Support both single imageUrl and images[] array */
  const images = product.images?.length
    ? product.images
    : [product.imageUrl].filter(Boolean);

  return (
    <div className="page-enter min-h-screen" style={{ paddingTop: "5rem" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* ── Back button ── */}
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm mb-6 sm:mb-8 transition-all hover:gap-2.5 group"
          style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 mb-10 sm:mb-16">

          {/* ── Image panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full"
          >
            {/* Main image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-square mb-3"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={images[imgIdx]}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              {product.badge && (
                <span className={`badge absolute top-3 sm:top-5 left-3 sm:left-5 text-xs ${badgeMap[product.badgeType] ?? "badge-blue"}`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="badge badge-red absolute top-3 sm:top-5 right-3 sm:right-5 text-xs">
                  -{discount}% OFF
                </span>
              )}

              {/* Prev/Next for multiple images */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                    style={{ background: "rgba(8,12,20,0.6)", border: "1px solid var(--border)" }}>
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                    style={{ background: "rgba(8,12,20,0.6)", border: "1px solid var(--border)" }}>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all"
                    style={{
                      border: i === imgIdx
                        ? "2px solid var(--primary)"
                        : "2px solid var(--border)",
                      opacity: i === imgIdx ? 1 : 0.6,
                    }}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category */}
            <p className="text-xs sm:text-sm font-mono mb-1.5 sm:mb-2"
              style={{ color: "var(--accent)" }}>
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-7 leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              {product.title}
            </h1>

            {/* Rating row */}
            {/* <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <Stars n={Math.round(product.rating ?? 0)} size="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {product.rating && (
                <span className="text-xs sm:text-sm font-bold" style={{ color: "var(--fg)" }}>
                  {product.rating}
                </span>
              )}
              {product.reviews && (
                <span className="text-xs sm:text-sm" style={{ color: "var(--fg-muted)" }}>
                  ({Number(product.reviews).toLocaleString()} reviews)
                </span>
              )}
            </div> */}

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6">
              <span className="price-tag text-3xl sm:text-4xl">${product.price}</span>
              {product.originalPrice && (
                <span className="text-base sm:text-xl line-through" style={{ color: "var(--fg-subtle)" }}>
                  ${product.originalPrice}
                </span>
              )}
              {discount && (
                <span className="badge badge-green text-xs sm:text-sm">Save {discount}%</span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {product.inStock !== false
                ? <>
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: "var(--success)" }} />
                    <span className="text-xs sm:text-sm font-semibold" style={{ color: "var(--success)" }}>
                      In Stock — Ready to ship
                    </span>
                  </>
                : <>
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: "var(--danger)" }} />
                    <span className="text-xs sm:text-sm font-semibold" style={{ color: "var(--danger)" }}>
                      Out of Stock
                    </span>
                  </>
              }
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-xs sm:text-sm leading-relaxed mb-3"
                style={{ color: "var(--fg-muted)" }}>
                {product.shortDescription}
              </p>
            )}

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8"
              style={{ color: "var(--fg-muted)" }}>
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              <button
                disabled={product.inStock === false}
                className="btn-primary flex-1 sm:flex-none px-5 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => setWished(w => !w)}
                className="btn-outline px-3.5 sm:px-4 py-3 sm:py-3.5 transition-all"
                style={{ color: wished ? "#ef4444" : undefined }}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wished ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="btn-outline px-3.5 sm:px-4 py-3 sm:py-3.5 relative"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-lg whitespace-nowrap"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}>
                    Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3 mt-auto">
              {[
                { icon: Truck,     label: "Free Delivery",   sub: "Orders over $50" },
                { icon: Shield,    label: "2-Year Warranty", sub: "Full coverage"    },
                { icon: RotateCcw, label: "30-Day Returns",  sub: "No questions"     },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl"
                  style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: "var(--primary)" }} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight"
                      style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>{label}</p>
                    <p className="text-xs leading-tight" style={{ color: "var(--fg-subtle)" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Specs ── */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 sm:mb-16"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              Specifications
            </h2>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)" }}>
              {Object.entries(product.specs).map(([k, v], i) => (
                <div key={k}
                  className="flex items-start sm:items-center"
                  style={{
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                    background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-hover)",
                  }}>
                  <div className="w-2/5 sm:w-1/3 px-3 sm:px-5 py-3 sm:py-3.5 shrink-0">
                    <p className="text-xs font-bold uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--fg-subtle)" }}>
                      {k}
                    </p>
                  </div>
                  <div className="flex-1 px-3 sm:px-5 py-3 sm:py-3.5"
                    style={{ borderLeft: "1px solid var(--border)" }}>
                    <p className="text-xs sm:text-sm" style={{ color: "var(--fg)" }}>{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map(p => <RelatedCard key={p._id} p={p} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}