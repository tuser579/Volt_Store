"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap, Shield, Award, Users, Heart, Target,
  Headphones, Star, ArrowRight, CheckCircle2,
  Globe, Truck, RotateCcw, Clock
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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


const values = [
  {
    icon: Shield,
    title: "Quality First",
    desc: "Every product passes a rigorous 47-point quality check before it enters our catalogue. No compromises.",
    color: "var(--primary)",
    glow: "var(--primary-glow)",
  },
  {
    icon: Heart,
    title: "Customer Obsessed",
    desc: "We answer every support ticket within 2 hours. Real people, not bots — because you deserve better.",
    color: "var(--danger)",
    glow: "rgba(239,68,68,0.15)",
  },
  {
    icon: Target,
    title: "Honest Curation",
    desc: "We only stock gear we would personally buy. If it does not impress us, it will not make it to the store.",
    color: "var(--accent)",
    glow: "var(--accent-glow)",
  },
  {
    icon: Globe,
    title: "Built to Last",
    desc: "Sustainability matters. We partner with brands that build durable products, reducing e-waste for good.",
    color: "var(--success)",
    glow: "rgba(34,197,94,0.15)",
  },
];

const milestones = [
  { year: "2024", title: "Founded", desc: "Started in a small apartment with 12 products and a big dream." },
  { year: "2025", title: "100+ Customers", desc: "Hit our first milestone — community kept us going every step of the way." },
  { year: "2025", title: "20 Products", desc: "Expanded our catalogue and launched our 2-year warranty programme." },
  { year: "2026", title: "Expert Team", desc: "Hired dedicated audio specialists and launched 24/7 support." },
  { year: "2026", title: "500 Community", desc: "Reached 100+ happy customers and growing fast." },
];

const perks = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
  { icon: Shield, label: "2-Year Warranty", sub: "Full coverage" },
  { icon: RotateCcw, label: "30-Day Returns", sub: "No questions asked" },
  { icon: Clock, label: "24/7 Support", sub: "Real humans, fast" },
];

/* ── shared section style helper ──────────────────────────
   odd  sections (1,3,5…) → var(--bg)
   even sections (2,4,6…) → var(--bg-card)
   every section gets the same bottom padding via .section-pad
─────────────────────────────────────────────────────────── */
const S = {
  odd: { background: "var(--bg)" },
  even: { background: "var(--bg-card)" },
};

export default function AboutPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-badge", { opacity: 0, y: -20, duration: 0.6, delay: 0.2 });
      gsap.from(".about-h1", { opacity: 0, y: 40, duration: 0.8, delay: 0.35, ease: "power3.out" });
      gsap.from(".about-sub", { opacity: 0, y: 20, duration: 0.6, delay: 0.55 });
      gsap.from(".about-stat", { opacity: 0, y: 24, duration: 0.5, delay: 0.7, stagger: 0.1 });
      gsap.from(".about-orb", { opacity: 0, scale: 0, duration: 1.2, delay: 0.1, ease: "power2.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="page-enter min-h-screen" style={{ paddingTop: "4rem" }}>

      {/* ══ 1. HERO — bg: var(--bg) ══════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden py-8 sm:py-15"
        style={S.odd}
      >
        <div className="about-orb absolute top-1/4 left-1/4 w-125 h-125 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />
        <div className="about-orb absolute bottom-1/4 right-1/4 w-87.5 h-87.5 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center items-center">
          <div className="max-w-3xl">
            <div className="about-badge w-27 flex justify-center mx-auto gap-2 badge badge-blue mb-6">
              <Zap className="w-3 h-3" /> OUR STORY
            </div>
            <h1 className="about-h1 text-center text-3xl sm:text-5xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}>
              <span style={{ color: "var(--fg)" }}>We Are Obsessed</span><br />
              <span className="text-gradient">With Great Sound</span>
            </h1>
            <p className="about-sub text-center text-lg sm:text-xl max-w-2xl"
              style={{ color: "var(--fg-muted)", lineHeight: 1.8 }}>
              Volt Store was born out of frustration — overpriced gear, underwhelming quality,
              and zero honest advice. We set out to fix all three. Today we are trusted by
              100+ customers who demand more from their audio experience.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 2. VALUES — bg: var(--bg-card) ══════════════ */}
      <section className="" style={S.odd}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="badge badge-blue mb-4">What We Stand For</span>
            <h2 className="text-4xl font-extrabold"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              Our Core Values
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="card p-6 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shrink-0"
                    style={{ background: v.glow, color: v.color }}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--fg-muted)" }}>
                    {v.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. TIMELINE — bg: var(--bg) ═════════════════ */}
      <section className="section-pad" style={S.odd}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="badge badge-amber mb-4">Our Journey</span>
            <h2 className="text-4xl font-extrabold"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              How We Got Here
            </h2>
          </FadeIn>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: "var(--border)" }} />

            <div className="flex flex-col gap-10">
              {milestones.map((m, i) => (
                <FadeIn key={m.title} delay={i * 0.08}>
                  <div className={`relative flex flex-row sm:${i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    } items-start gap-6`}>
                    {/* Dot */}
                    <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-2 z-10"
                      style={{ background: "var(--primary)", boxShadow: "0 0 12px var(--primary-glow)" }} />
                    {/* Card */}
                    <div className={`ml-10 sm:ml-0 sm:w-[calc(50%-2rem)] card p-5 ${i % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto"
                      }`}>
                      <span className="badge badge-blue mb-2">{m.year}</span>
                      <h3 className="text-sm font-bold mb-1"
                        style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                        {m.title}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. PERKS — bg: var(--bg-card) ═══════════════ */}
      <section className="" style={S.odd}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="badge badge-blue mb-4">Why Shop With Us</span>
            <h2 className="text-4xl font-extrabold"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              Every Purchase, Protected
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {perks.map((p, i) => (
              <FadeIn key={p.label} delay={i * 0.08}>
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--primary-glow)", color: "var(--primary)" }}>
                    <p.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                    {p.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{p.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. CTA — bg: var(--bg) ═══════════════════════ */}
      <section className="section-pad relative overflow-hidden bg-grid" style={S.odd}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <span className="badge badge-cyan mb-6">
              <Award className="w-3 h-3" /> Join the Community
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              Ready to Upgrade<br />
              <span className="text-gradient">Your Sound?</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: "var(--fg-muted)", lineHeight: 1.8 }}>
              Browse our hand-picked catalogue of premium audio gear and accessories.
              Free shipping over $50. 30-day returns. Zero regrets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="flex justify-center btn-primary px-8 py-3.5 text-base">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/register" className="flex justify-center btn-outline px-8 py-3.5 text-base">
                Create Account
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}