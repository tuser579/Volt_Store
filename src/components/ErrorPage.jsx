"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { Zap, Home, ArrowLeft, ShoppingBag, RotateCcw, Search } from "lucide-react";

/* ── Glitch text ─────────────────────────────────────────── */
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";

function GlitchText({ text, style }) {
  const [display, setDisplay] = useState(text);
  const glitching = useRef(false);
  const intervalRef = useRef(null);

  const triggerGlitch = () => {
    if (glitching.current) return;
    glitching.current = true;
    let iter = 0;
    const total = text.length * 3;
    intervalRef.current = setInterval(() => {
      setDisplay(
        text.split("").map((c, i) =>
          i < iter / 3 ? c : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join("")
      );
      iter++;
      if (iter > total) {
        clearInterval(intervalRef.current);
        setDisplay(text);
        glitching.current = false;
      }
    }, 30);
  };

  useEffect(() => {
    const t1 = setTimeout(triggerGlitch, 900);
    const t2 = setInterval(triggerGlitch, 4000);
    return () => { clearTimeout(t1); clearInterval(t2); clearInterval(intervalRef.current); };
  }, []);

  return <span style={style} onMouseEnter={triggerGlitch}>{display}</span>;
}

/* ── Quick links ─────────────────────────────────────────── */
const quickLinks = [
  { icon: Home,        label: "Go Home",       href: "/"         },
  { icon: ShoppingBag, label: "Shop Products", href: "/products" },
  { icon: Search,      label: "Contact Us",    href: "/contact"  },
];

/* ── Corner brackets data ────────────────────────────────── */
const corners = [
  { style: { top: "1.5rem",    left:  "1.5rem"  }, d: "M2 12 L2 2 L12 2"     },
  { style: { top: "1.5rem",    right: "1.5rem"  }, d: "M22 12 L22 2 L12 2"   },
  { style: { bottom: "1.5rem", left:  "1.5rem"  }, d: "M2 12 L2 22 L12 22"   },
  { style: { bottom: "1.5rem", right: "1.5rem"  }, d: "M22 12 L22 22 L12 22" },
];

/* ════════════════════════════════════════════════════════════
   NOT FOUND PAGE
═══════════════════════════════════════════════════════════ */
export default function NotFound() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  /* Particles — client-only, never rendered on server */
  const [particles, setParticles] = useState(null);

  useEffect(() => {
    // Generate AFTER hydration — completely avoids SSR mismatch
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color:
          i % 3 === 0 ? "rgba(59,130,246,0.6)"
          : i % 3 === 1 ? "rgba(6,182,212,0.5)"
          : "rgba(139,92,246,0.4)",
        dur:   Math.random() * 3 + 2,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  /* GSAP entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nf-404",     { opacity: 0, scale: 0.6, duration: 1,   ease: "expo.out",    delay: 0.1 });
      gsap.from(".nf-title",   { opacity: 0, y: 40,      duration: 0.7, ease: "power3.out",  delay: 0.5 });
      gsap.from(".nf-sub",     { opacity: 0, y: 24,      duration: 0.6, ease: "power3.out",  delay: 0.7 });
      gsap.from(".nf-actions", { opacity: 0, y: 20,      duration: 0.5, ease: "power2.out",  delay: 0.9 });
      gsap.from(".nf-links",   { opacity: 0, y: 16,      duration: 0.5, ease: "power2.out",  delay: 1.1 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  /* Mouse parallax */
  const handleMouse = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left)  / rect.width  - 0.5) * 30);
    mouseY.set(((e.clientY - rect.top)   / rect.height - 0.5) * 30);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouse}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#080c14" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          "linear-gradient(rgba(30,45,69,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,69,0.35) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Particles — only rendered after mount, never on server */}
      {particles && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left:       `${p.x}%`,
            top:        `${p.y}%`,
            width:      p.size,
            height:     p.size,
            background: p.color,
          }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Orbs with parallax */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)",
          x: springX, y: springY,
        }}
      />
      <motion.div className="absolute top-1/4 right-1/4 rounded-full pointer-events-none"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)",
          x: springX, y: springY,
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-12"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
            <span style={{ color: "#e8edf5" }}>VOLT</span>
            <span style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}> STORE</span>
          </span>
        </motion.div>

        {/* 404 */}
        <div className="nf-404 relative mb-6 select-none">
          {/* Shadow */}
          <span className="absolute inset-0 pointer-events-none" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: "clamp(7rem, 22vw, 18rem)", lineHeight: 1,
            color: "transparent", WebkitTextStroke: "1px rgba(59,130,246,0.15)",
            letterSpacing: "-0.04em", transform: "translate(4px, 4px)",
          }}>404</span>

          {/* Glitch 404 */}
          <GlitchText text="404" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: "clamp(7rem, 22vw, 18rem)", lineHeight: 1,
            letterSpacing: "-0.04em", display: "block",
            background: "linear-gradient(135deg, #e8edf5 0%, #3b82f6 40%, #06b6d4 70%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(59,130,246,0.35))",
          }} />

          {/* Glitch lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ mixBlendMode: "screen" }}>
            {[0.2, 0.5, 0.75].map((pos, i) => (
              <motion.div key={i}
                className="absolute left-0 right-0 h-px"
                style={{ top: `${pos * 100}%`, background: "rgba(59,130,246,0.5)" }}
                animate={{ opacity: [0, 0.8, 0], x: [0, 8, -4, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 + i * 1.2 }}
              />
            ))}
          </div>
        </div>

        {/* Divider badge */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-4 mb-8 w-full max-w-xs"
        >
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
            letterSpacing: "0.2em", color: "#3b82f6", textTransform: "uppercase",
            padding: "0.2rem 0.6rem", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "999px", background: "rgba(59,130,246,0.08)",
          }}>
            PAGE NOT FOUND
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </motion.div>

        {/* Title */}
        <h1 className="nf-title text-2xl sm:text-3xl font-extrabold mb-4"
          style={{ fontFamily: "'Syne', sans-serif", color: "#e8edf5" }}>
          Oops — You Fell Off the Grid
        </h1>

        {/* Subtitle */}
        <p className="nf-sub text-sm sm:text-base mb-10 max-w-md leading-relaxed"
          style={{ color: "#8899b4" }}>
          The page you are looking for has been moved, deleted, or never existed.
          Let us get you back on track.
        </p>

        {/* Actions */}
        <div className="nf-actions flex flex-col sm:flex-row gap-3 mb-12">
          <Link href="/"
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              boxShadow: "0 0 24px rgba(59,130,246,0.35)",
              fontFamily: "'Syne', sans-serif",
            }}>
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <button onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#8899b4", fontFamily: "'Syne', sans-serif",
            }}>
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#8899b4", fontFamily: "'Syne', sans-serif",
            }}>
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
        </div>

        {/* Quick links */}
        <div className="nf-links w-full max-w-sm">
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
            letterSpacing: "0.2em", color: "#4a5568", textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}>
            Or try one of these
          </p>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(({ icon: Icon, label, href }, i) => (
              <motion.div key={href}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}>
                <Link href={href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.08)";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#3b82f6" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#8899b4", fontWeight: 500 }}>
                    {label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer code */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="mt-12"
          style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "0.15em", color: "#2a3f5f",
          }}
        >
          ERR_404 · VOLT_STORE · {new Date().getFullYear()}
        </motion.p>
      </div>

      {/* Corner brackets */}
      {corners.map((c, i) => (
        <motion.div key={i} className="absolute w-6 h-6 pointer-events-none"
          style={c.style}
          initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
          transition={{ delay: 0.3 + i * 0.1 }}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d={c.d} stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}