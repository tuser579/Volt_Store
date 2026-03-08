"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Zap, Star, Shield, RotateCcw, Headphones,
  ChevronRight, Play, TrendingUp, Award, Users, Clock,
  ChevronLeft, Pause
} from "lucide-react";
import { features, testimonials, stats } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

/* ── FadeIn wrapper ── */
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

/* ── Stars ── */
const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < n ? "fill-current" : "opacity-30"}`}
        style={{ color: "var(--warning)" }} />
    ))}
  </div>
);

/* ── Product Card (featured section) ── */
const ProductCard = ({ product, index }) => {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const badgeColors = { warning: "badge-amber", cyan: "badge-cyan", green: "badge-green", red: "badge-red", blue: "badge-blue" };
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="card group cursor-pointer overflow-hidden flex flex-col">
      <div className="relative h-60 overflow-hidden aspect-square" style={{ background: "var(--bg-hover)" }}>
        <img src={product.imageUrl} alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {product.badge && (
          <span className={`badge absolute top-3 left-3 ${badgeColors[product.badgeType] ?? "badge-blue"}`}>
            {product.badge}
          </span>
        )}
        {/* {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(8,12,20,0.7)" }}>
            <span className="badge badge-red">Out of Stock</span>
          </div>
        )} */}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-mono mb-1" style={{ color: "var(--accent)" }}>{product.category}</p>
        <h3 className="text-sm font-semibold mb-1 line-clamp-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
          {product.title}
        </h3>
        <p className="text-xs mb-3 line-clamp-2 flex-1" style={{ color: "var(--fg-muted)", lineHeight: 1.5 }}>
          {product.shortDescription}
        </p>
        {(product.rating || product.reviews) && (
          <div className="flex items-center gap-2 mb-3">
            <Stars n={Math.round(product.rating)} />
            <span className="text-xs font-mono" style={{ color: "var(--fg-subtle)" }}>({product.reviews})</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="price-tag text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs line-through" style={{ color: "var(--fg-subtle)" }}>
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Link href={`/products/${product._id}`} className="btn-primary text-sm px-5 py-1.5 rounded-xl">
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════
   HERO SLIDER
════════════════════════════════════════════════════════ */
function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1=next, -1=prev
  const intervalRef = useRef(null);

  /* Fetch top 3 products from API */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products?page=1&limit=3&sort=default");
        const data = await res.json();
        if (data.products?.length) setSlides(data.products);
      } catch (e) {
        console.error("Slider fetch failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Auto-advance every 4 s */
  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(c => (c + 1) % slides.length);
    }, 4000);
  }, [slides.length]);

  useEffect(() => {
    if (!paused && slides.length > 1) startInterval();
    return () => clearInterval(intervalRef.current);
  }, [paused, slides.length, startInterval]);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    startInterval();
  };
  const prev = () => { setDirection(-1); setCurrent(c => (c - 1 + slides.length) % slides.length); startInterval(); };
  const next = () => { setDirection(1); setCurrent(c => (c + 1) % slides.length); startInterval(); };

  /* Skeleton */
  if (loading) {
    return (
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-110 lg:h-110">
        <div className="w-full h-full rounded-3xl animate-pulse" style={{ background: "var(--bg-card)" }} />
        <div className="absolute -bottom-4 -left-6 rounded-2xl px-4 py-3 w-44 h-16 animate-pulse"
          style={{ background: "var(--bg-card)" }} />
        <div className="absolute -top-4 -right-4 rounded-2xl px-4 py-3 w-24 h-14 animate-pulse"
          style={{ background: "var(--bg-card)" }} />
      </div>
    );
  }

  if (!slides.length) return null;

  const p = slides[current];

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.96 }),
  };

  return (
    <div className="flex justify-center lg:justify-end relative">
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-110 lg:h-110"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>

        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15), transparent 70%)" }} />

        {/* Slide image */}
        <div className="w-full h-full rounded-3xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={p._id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              src={p.imageUrl}
              alt={p.title}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* Prev / Next arrows */}
        {slides.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(8,12,20,0.6)", border: "1px solid var(--border)", color: "white" }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(8,12,20,0.6)", border: "1px solid var(--border)", color: "white" }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  background: i === current ? "var(--primary)" : "var(--border)",
                }}
              />
            ))}
          </div>
        )}

        {/* Pause indicator */}
        {paused && slides.length > 1 && (
          <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "rgba(8,12,20,0.5)" }}>
            <Pause className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Floating product info card */}
        <AnimatePresence mode="wait">
          <motion.div key={`card-${p._id}`}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute -bottom-4 -left-6 glass rounded-2xl px-4 py-3"
            style={{ border: "1px solid var(--border-bright)", maxWidth: 180 }}>
            <p className="text-xs font-mono mb-0.5 truncate" style={{ color: "var(--accent)" }}>
              {p.category?.toUpperCase()}
            </p>
            <p className="text-sm font-bold line-clamp-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              {p.title}
            </p>
            {(p.rating || p.reviews) && (
              <div className="flex items-center gap-1.5 mt-1">
                <Stars n={Math.round(p.rating)} />
                <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{p.reviews} reviews</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating price tag */}
        <AnimatePresence mode="wait">
          <motion.div key={`price-${p._id}`}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 text-center">
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>From</p>
            <p className="price-tag text-xl">${p.price}</p>
          </motion.div>
        </AnimatePresence>

        {/* Slide counter */}
        <div className="absolute top-3 left-3 z-10 rounded-lg px-2 py-1"
          style={{ background: "rgba(8,12,20,0.55)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--fg-muted)" }}>
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

/* ── Featured products from API ── */
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products?page=1&limit=4&sort=default");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-square animate-pulse" style={{ background: "var(--bg-hover)" }} />
            <div className="p-4 space-y-2.5">
              <div className="h-3 rounded animate-pulse w-16" style={{ background: "var(--bg-hover)" }} />
              <div className="h-4 rounded animate-pulse w-4/5" style={{ background: "var(--bg-hover)" }} />
              <div className="h-3 rounded animate-pulse w-full" style={{ background: "var(--bg-hover)" }} />
              <div className="flex justify-between items-center pt-1">
                <div className="h-5 rounded animate-pulse w-14" style={{ background: "var(--bg-hover)" }} />
                <div className="h-7 rounded-lg animate-pulse w-16" style={{ background: "var(--bg-hover)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
    </div>
  );
}

/* ── Deals mini-cards from API ── */
function DealsGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products?page=1&limit=4&sort=price-desc");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (e) { console.error(e); }
    })();
  }, []);

  if (!products.length) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-3">
            <div className="aspect-square rounded-xl animate-pulse mb-3" style={{ background: "var(--bg-hover)" }} />
            <div className="h-3 rounded animate-pulse w-3/4 mb-1" style={{ background: "var(--bg-hover)" }} />
            <div className="h-4 rounded animate-pulse w-1/2" style={{ background: "var(--bg-hover)" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((p, i) => (
        <FadeIn key={p._id} delay={i * 0.1}>
          <Link href={`/products/${p._id}`} className="card p-3 group block">
            <div className="aspect-square rounded-xl overflow-hidden mb-3" style={{ background: "var(--bg-hover)" }}>
              <img src={p.imageUrl} alt={p.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="text-xs font-semibold truncate"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              {p.title}
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="price-tag text-sm">${p.price}</span>
              {p.originalPrice && (
                <span className="text-xs badge badge-amber">
                  -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                </span>
              )}
            </div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", { opacity: 0, y: -20, duration: 0.6, delay: 0.2 });
      gsap.from(".hero-h1", { opacity: 0, y: 40, duration: 0.8, delay: 0.35, ease: "power3.out" });
      gsap.from(".hero-sub", { opacity: 0, y: 20, duration: 0.6, delay: 0.55 });
      gsap.from(".hero-btns", { opacity: 0, y: 20, duration: 0.6, delay: 0.7 });
      gsap.from(".hero-stats", { opacity: 0, y: 20, duration: 0.6, delay: 0.85 });
      gsap.from(".hero-img", { opacity: 0, scale: 0.9, duration: 0.9, delay: 0.4, ease: "power2.out" });
      gsap.from(".hero-orb", { opacity: 0, scale: 0, duration: 1.2, delay: 0.2, ease: "power2.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="page-enter">

      {/* ── 1. HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden"
        style={{ paddingTop: "5rem", background: "var(--bg)" }}>
        <div className="hero-orb absolute top-1/4 left-1/4 w-125 h-125 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
        <div className="hero-orb absolute bottom-1/4 right-1/4 w-100 h-100 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-15">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div>
              <div className="hero-badge inline-flex items-center gap-2 badge badge-blue mb-6">
                <Zap className="w-3 h-3" /> NEW 2026 COLLECTION
              </div>
              <h1 className="hero-h1 text-4xl sm:text-5xl font-extrabold leading-tight mb-6"
                style={{ fontFamily: "var(--font-display)" }}>
                <span style={{ color: "var(--fg)" }}>Sound That</span><br />
                <span className="text-gradient">Moves You</span>
              </h1>
              <p className="hero-sub text-lg mb-8 max-w-lg" style={{ color: "var(--fg-muted)", lineHeight: 1.7 }}>
                Discover premium headphones, earbuds & charging gear designed for those who demand more from every listening moment.
              </p>
              <div className="hero-btns flex flex-wrap gap-4 mb-12">
                <Link href="/products" className="w-full sm:w-45 flex justify-center btn-primary px-6 py-3 text-base">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#featured" className="w-full sm:w-45 flex justify-center btn-outline px-6 py-3 text-base">
                  <Play className="w-4 h-4" /> Watch Demo
                </a>
              </div>
              {/* Stats */}
              <div className="hero-stats grid grid-cols-4 gap-4">
                {stats.map(s => (
                  <div key={s.label}>
                    <p className="text-xl font-extrabold text-gradient" style={{ fontFamily: "var(--font-display)" }}>
                      {s.value}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--fg-subtle)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Hero Slider — top 3 products from DB ── */}
            <div className="hero-img">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURES ── */}
      <section className="pt-8" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="badge badge-blue mb-4">Why Volt Store</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
              Built for Audio Enthusiasts
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const icons = { Zap, Shield, RotateCcw, Headphones };
              const Icon = icons[f.icon] ?? Zap;
              return (
                <FadeIn key={f.title} delay={i * 0.1}>
                  <div className="card p-6 h-full">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: "var(--primary-glow)", color: "var(--primary)" }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                      {f.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>{f.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED PRODUCTS ── */}
      <section id="featured" className="section-pad" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <span className="badge badge-cyan mb-3">Featured</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                Top Picks
              </h2>
            </div>
            <Link href="/products" className="btn-outline px-5 py-2.5 text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>
          <FeaturedProducts />
        </div>
      </section>

      {/* ── 4. BANNER / DEALS ── */}
      <section id="deals" className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75"
          style={{ background: "radial-gradient(ellipse at top, rgba(59,130,246,0.15), transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <span className="badge badge-amber mb-4">
                <TrendingUp className="w-3 h-3" /> LIMITED OFFER
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Up to <span className="text-gradient-gold">30% OFF</span><br />
                This Weekend
              </h2>
              <p className="text-lg mb-6" style={{ color: "var(--fg-muted)" }}>
                Handpicked deals on our most-loved audio gear. Limited stock — grab yours before it&apos;s gone.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <Clock className="w-5 h-5" style={{ color: "var(--warning)" }} />
                <div className="flex gap-3">
                  {[["12", "HRS"], ["45", "MIN"], ["30", "SEC"]].map(([n, l]) => (
                    <div key={l} className="text-center rounded-xl px-3 py-2"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                      <p className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--warning)" }}>{n}</p>
                      <p className="text-xs font-mono" style={{ color: "var(--fg-subtle)" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/products" className="btn-primary px-6 py-3">
                Grab the Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
            <DealsGrid />
          </div>
        </div>
      </section>

      {/* ── 5. CATEGORIES ── */}
      <section className="pt-30" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="badge badge-blue mb-4">Browse By</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
              Shop Categories
            </h2>
          </FadeIn>
          <CategoriesGrid />
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="pt-30" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="badge badge-green mb-4"><Users className="w-3 h-3" /> Customer Love</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
              What Our Customers Say
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="card p-5 h-full flex flex-col">
                  <Stars n={t.rating} />
                  <p className="text-sm mt-3 flex-1 leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-4"
                    style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "var(--fg-subtle)" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ABOUT / CTA ── */}
      <section className="section-pad relative overflow-hidden" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <FadeIn>
            <span className="badge badge-blue mb-6"><Award className="w-3 h-3" /> Our Story</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Obsessed With<br /><span className="text-gradient">Great Sound</span>
            </h2>
            <p className="text-lg mb-4 max-w-2xl mx-auto" style={{ color: "var(--fg-muted)", lineHeight: 1.8 }}>
              Volt Store was founded by audio enthusiasts who were tired of overpriced gear and underwhelming quality.
              We source only the best electronics — tested by our team before they reach you.
            </p>
            <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: "var(--fg-muted)" }}>
              Every product in our catalogue passes a 47-point quality check. That&apos;s our promise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="flex justify-center btn-primary px-8 py-3.5 text-base">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#deals" className="flex justify-center btn-outline px-8 py-3.5 text-base">
                View Deals
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}

/* ── Categories grid — fetches one product per category for images ── */
function CategoriesGrid() {
  const CATS = [
    { label: "Headphones", count: 12 },
    { label: "Earbuds", count: 18 },
    { label: "Power Banks", count: 9 },
    { label: "Speakers", count: 7 },
  ];
  const [images, setImages] = useState({});

  useEffect(() => {
    (async () => {
      const results = await Promise.allSettled(
        CATS.map(c =>
          fetch(`/api/products?page=1&limit=1&category=${encodeURIComponent(c.label)}`)
            .then(r => r.json())
            .then(d => ({ label: c.label, img: d.products?.[0]?.imageUrl }))
        )
      );
      const map = {};
      results.forEach(r => { if (r.status === "fulfilled" && r.value.img) map[r.value.label] = r.value.img; });
      setImages(map);
    })();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {CATS.map((cat, i) => (
        <FadeIn key={cat.label} delay={i * 0.08}>
          <Link href={`/products?cat=${cat.label}`} className="card group relative overflow-hidden aspect-4/3 block">
            {images[cat.label] ? (
              <img src={images[cat.label]} alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full animate-pulse" style={{ background: "var(--bg-hover)" }} />
            )}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(8,12,20,0.85) 0%, transparent 60%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-bold text-sm mb-0.5" style={{ fontFamily: "var(--font-display)", color: "white" }}>
                {cat.label}
              </p>
              <p className="text-xs font-mono" style={{ color: "var(--accent)" }}>{cat.count} products</p>
            </div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}