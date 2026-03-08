"use client";

import { motion } from "framer-motion";

/* ── Pulse shimmer block ─────────────────────────────────── */
function Bone({ className = "", style = {} }) {
  return (
    <motion.div
      className={`rounded-lg ${className}`}
      style={{
        background: "linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-elevated) 50%, var(--bg-hover) 75%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Single card skeleton ────────────────────────────────── */
function CardSkeleton({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      {/* Image area */}
      <div className="relative aspect-square">
        <Bone className="w-full h-full rounded-none" />
        {/* Badge placeholder */}
        <div className="absolute top-3 left-3">
          <Bone className="h-5 w-14 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Category */}
        <Bone className="h-3 w-16" />
        {/* Title */}
        <Bone className="h-4 w-full" />
        {/* Description */}
        <div className="flex flex-col gap-1.5 flex-1">
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-4/5" />
        </div>
        {/* Stars */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={i} className="h-3 w-3 rounded-full" />
          ))}
          <Bone className="h-3 w-12 ml-1" />
        </div>
        {/* Price + button */}
        <div className="flex items-center justify-between">
          <Bone className="h-6 w-16" />
          <Bone className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── List row skeleton ───────────────────────────────────── */
function RowSkeleton({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl p-4 flex gap-4"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      {/* Thumbnail */}
      <Bone className="w-28 h-28 shrink-0 rounded-xl" />
      {/* Content */}
      <div className="flex-1 flex flex-col gap-2.5">
        <Bone className="h-3 w-20" />
        <Bone className="h-4 w-56" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-3/4" />
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => <Bone key={i} className="h-3 w-3 rounded-full" />)}
            <Bone className="h-3 w-14 ml-1" />
          </div>
          <div className="flex items-center gap-4">
            <Bone className="h-6 w-16" />
            <Bone className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   PRODUCTS SKELETON
═══════════════════════════════════════════════════════════ */
export default function ProductsSkeleton({ view = "grid" }) {
  return (
    <div className="min-h-screen" style={{ paddingTop: "5rem" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header skeleton ── */}
        <div className="mb-10 flex flex-col gap-3">
          <Bone className="h-5 w-24 rounded-full" />
          <Bone className="h-10 w-72" />
          <Bone className="h-4 w-52" />
        </div>

        {/* ── Filter bar skeleton ── */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search bar */}
          <Bone className="h-10 flex-1 max-w-md rounded-xl" />

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {["All", "Headphones", "Earbuds", "Speakers", "Accessories"].map((_, i) => (
              <Bone key={i} className="h-8 rounded-lg" style={{ width: `${60 + i * 10}px` }} />
            ))}
          </div>

          {/* Sort + view toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <Bone className="h-9 w-36 rounded-xl" />
            <Bone className="h-9 w-20 rounded-lg" />
          </div>
        </div>

        {/* ── Results count ── */}
        <Bone className="h-4 w-36 mb-6" />

        {/* ── Cards ── */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} delay={i * 0.05} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <RowSkeleton key={i} delay={i * 0.06} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}