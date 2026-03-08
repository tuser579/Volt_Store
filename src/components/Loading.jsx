"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState(0); // 0=charging, 1=done
  const [done, setDone]         = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const steps = [
      { target: 30,  delay: 0,    speed: 18 },
      { target: 60,  delay: 300,  speed: 12 },
      { target: 85,  delay: 600,  speed: 20 },
      { target: 100, delay: 900,  speed: 8  },
    ];

    let current = 0;
    let timeouts = [];

    steps.forEach(({ target, delay, speed }) => {
      const t = setTimeout(() => {
        const interval = setInterval(() => {
          current += 1;
          setProgress(current);
          if (current >= target) clearInterval(interval);
        }, speed);
        timeouts.push(interval);
      }, delay);
      timeouts.push(t);
    });

    // Phase transitions
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setDone(true), 2000);
    timeouts.push(t1, t2);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#080c14" }}
        >
          {/* ── Grid background ── */}
          <div className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(30,45,69,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,69,0.35) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* ── Radial glow behind logo ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 600,
              height: 600,
              background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Floating orb top-right ── */}
          <motion.div
            className="absolute top-1/4 right-1/4 rounded-full pointer-events-none"
            style={{
              width: 250,
              height: 250,
              background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
            }}
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col items-center gap-10">

            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center gap-5"
            >
              {/* Icon */}
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
                  animate={{ boxShadow: ["0 0 30px rgba(59,130,246,0.3)", "0 0 60px rgba(59,130,246,0.6)", "0 0 30px rgba(59,130,246,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Bolt SVG */}
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <motion.path
                      d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z"
                      fill="white"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    />
                  </svg>
                </motion.div>

                {/* Rotating ring */}
                <motion.div
                  className="absolute -inset-2 rounded-3xl"
                  style={{
                    border: "1px solid transparent",
                    background: "linear-gradient(#080c14, #080c14) padding-box, linear-gradient(135deg, rgba(59,130,246,0.6), rgba(6,182,212,0.6), transparent, rgba(59,130,246,0.2)) border-box",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Wordmark */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center"
              >
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "2.2rem",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                }}>
                  <span style={{ color: "#e8edf5" }}>VOLT</span>
                  {" "}
                  <span style={{
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    STORE
                  </span>
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    color: "#4a5568",
                    marginTop: "0.35rem",
                    textTransform: "uppercase",
                  }}
                >
                  Premium Electronics
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Progress bar section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-col items-center gap-3"
              style={{ width: 280 }}
            >
              {/* Track */}
              <div className="relative w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}>
                {/* Fill */}
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                    boxShadow: "0 0 12px rgba(59,130,246,0.7)",
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute top-0 h-full w-16 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    left: `${Math.max(0, progress - 8)}%`,
                  }}
                />
              </div>

              {/* Percentage + status */}
              <div className="flex items-center justify-between w-full">
                <motion.span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#4a5568",
                    letterSpacing: "0.1em",
                  }}
                >
                  {phase === 0 ? "INITIALIZING" : "READY"}
                </motion.span>
                <motion.span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#3b82f6",
                    letterSpacing: "0.05em",
                  }}
                >
                  {progress}%
                </motion.span>
              </div>
            </motion.div>

            {/* Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#3b82f6" }}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* ── Corner decorations ── */}
          {[
            { top: "1.5rem", left:  "1.5rem", rotate: 0   },
            { top: "1.5rem", right: "1.5rem", rotate: 90  },
            { bottom: "1.5rem", left:  "1.5rem", rotate: 270 },
            { bottom: "1.5rem", right: "1.5rem", rotate: 180 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6"
              style={{ ...pos }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M2 12 L2 2 L12 2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          ))}

        </motion.div>
      )}
    </AnimatePresence>
  );
}