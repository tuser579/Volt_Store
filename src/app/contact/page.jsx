"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail, Phone, MapPin, MessageCircle,
  Send, CheckCircle2, Zap, ArrowRight,
  Clock, Shield, Headphones, Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

gsap.registerPlugin(ScrollTrigger);

/* ── Fade-in wrapper ─────────────────────────────────────── */
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

/* ── Contact info data ───────────────────────────────────── */
const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "tusermon720@gmail.com",
    sub: "We reply within 2 hours",
    href: "mailto:tusermon720@gmail.com",
    color: "var(--primary)",
    glow: "var(--primary-glow)",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+8801760049326",
    sub: "Mon – Fri, 9 AM – 6 PM EST",
    href: "tel:+8801760049326",
    color: "var(--success)",
    glow: "rgba(34,197,94,0.15)",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+8801760049326",
    sub: "Chat with us anytime",
    href: "https://wa.me/01760049326",
    color: "#25d366",
    glow: "rgba(37,211,102,0.15)",
  },
  {
    icon: MapPin,
    label: "Our Office",
    value: "Rajshahi, Bangladesh",
    sub: "Rajshahi Division, Bangladesh",
    href: "https://maps.google.com/?q=Rajshahi+Bangladesh",
    color: "var(--accent)",
    glow: "var(--accent-glow)"
  }
];

const faqs = [
  {
    q: "How fast do you ship?",
    a: "Same-day dispatch on orders placed before 2 PM. Standard delivery 2–5 business days.",
  },
  {
    q: "What is your return policy?",
    a: "30-day hassle-free returns. Just contact us and we handle the rest — no questions asked.",
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes! We ship to 40+ countries. International delivery takes 7–14 business days.",
  },
  {
    q: "How do I claim my warranty?",
    a: "Email us with your order number and a description of the issue. We cover all manufacturing defects for 2 years.",
  },
];

/* ════════════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const heroRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  /* ── GSAP hero animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-badge", { opacity: 0, y: -20, duration: 0.5, delay: 0.2 });
      gsap.from(".contact-h1", { opacity: 0, y: 36, duration: 0.7, delay: 0.35, ease: "power3.out" });
      gsap.from(".contact-sub", { opacity: 0, y: 18, duration: 0.5, delay: 0.5 });
      gsap.from(".contact-orb", { opacity: 0, scale: 0, duration: 1.1, delay: 0.1, ease: "power2.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Submit — real fetch to /api/contact ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Sending your message…", {
      style: { background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" },
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success("Message sent! We'll get back to you soon.", {
        id: loadingToast,
        style: { background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" },
        duration: 5000,
      });
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to send. Please try again.", {
        id: loadingToast,
        style: { background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" },
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setSent(false);
  };

  return (
    <div className="page-enter min-h-screen" style={{ paddingTop: "4rem" }}>
      <Toaster position="top-center" />

      {/* ══ 1. HERO ══════════════════════════════════════ */}
      <section ref={heroRef}
        className="relative overflow-hidden bg-grid pt-8 sm:pt-15"
        style={{ background: "var(--bg)" }}>

        <div className="contact-orb absolute top-1/4 right-1/4 w-112.5 h-112.5 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />
        <div className="contact-orb absolute bottom-0 left-1/3 w-75 h-75 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="contact-badge inline-flex items-center gap-2 badge badge-blue mb-6">
            <Zap className="w-3 h-3" /> GET IN TOUCH
          </div>
          <h1 className="contact-h1 text-3xl sm:text-5xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: "var(--fg)" }}>We Are Always</span><br />
            <span className="text-gradient">Here to Help</span>
          </h1>
          <p className="contact-sub text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--fg-muted)", lineHeight: 1.8 }}>
            Have a question, issue, or just want to say hello? Our expert team responds
            within 2 hours — every single day.
          </p>
        </div>
      </section>

      {/* ══ 2. MAIN CONTACT PANEL ════════════════════════ */}
      <section className="" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}>

            {/* ── LEFT — Contact Info ───────────────────── */}
            <FadeIn>
              <div className="flex flex-col h-full p-8 sm:p-10"
                style={{
                  background: "",
                  borderRight: "1px solid var(--border)",
                }}>

                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-lg"
                      style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                      VOLT STORE
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-3"
                    style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                    Contact Information
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    Reach us through any of the channels below. We are available
                    Monday through Friday, 9 AM to 6 PM EST — and on WhatsApp anytime.
                  </p>
                </div>

                {/* Info cards */}
                <div className="flex flex-col gap-4 flex-1">
                  {contactInfo.map((item, i) => (
                    <FadeIn key={item.label} delay={i * 0.08}>
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.borderColor = item.color;
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: item.glow, color: item.color }}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                            style={{ color: item.color, fontFamily: "var(--font-mono)" }}>
                            {item.label}
                          </p>
                          <p className="text-sm font-bold truncate"
                            style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}>
                            {item.value}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                            {item.sub}
                          </p>
                        </div>
                      </a>
                    </FadeIn>
                  ))}
                </div>

                {/* Bottom badges */}
                <div className="mt-8 pt-6 flex flex-wrap gap-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  {[
                    { icon: Clock, text: "2-hr response" },
                    { icon: Shield, text: "Secure contact" },
                    { icon: Headphones, text: "Expert support" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        color: "var(--primary)",
                        fontFamily: "var(--font-mono)",
                        border: "1px solid rgba(59,130,246,0.2)",
                      }}>
                      <Icon className="w-3 h-3" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ── RIGHT — Contact Form ──────────────────── */}
            <FadeIn delay={0.1}>
              <div className="flex flex-col h-full p-8 sm:p-10"
                style={{ background: "var(--bg)" }}>

                {!sent ? (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2"
                        style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                        Send a Message
                      </h2>
                      <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                        Fill out the form and we will get back to you shortly.
                      </p>
                    </div>

                    {/* ── Real form with fetch submit ── */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">

                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                          style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                          Full Name *
                        </label>
                        <input
                          id="name" name="name" type="text" required
                          placeholder="John Doe"
                          value={form.name}
                          disabled={loading}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="input-field disabled:opacity-60"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                          style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                          Email Address *
                        </label>
                        <input
                          id="email" name="email" type="email" required
                          placeholder="john@example.com"
                          value={form.email}
                          disabled={loading}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="input-field disabled:opacity-60"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                          style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                          Phone Number (optional)
                        </label>
                        <input
                          id="phone" name="phone" type="tel"
                          placeholder="+8801712123445"
                          value={form.phone}
                          disabled={loading}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          className="input-field disabled:opacity-60"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                          style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                          Message *
                        </label>
                        <textarea
                          id="message" name="message" rows={5} required
                          placeholder="Tell us how we can help you..."
                          value={form.message}
                          disabled={loading}
                          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          className="input-field resize-none disabled:opacity-60"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center mt-auto py-3.5 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>

                  </>
                ) : (
                  /* ── Success state ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center flex-1 text-center gap-5 py-10"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)" }}>
                      <CheckCircle2 className="w-10 h-10" style={{ color: "var(--success)" }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold mb-2"
                        style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
                        Message Sent!
                      </h3>
                      <p className="text-sm" style={{ color: "var(--fg-muted)", lineHeight: 1.7 }}>
                        Thanks for reaching out. Our team will get back to you
                        at <strong style={{ color: "var(--fg)" }}>{form.email}</strong> within 2 hours.
                      </p>
                    </div>
                    <button onClick={resetForm} className="btn-outline text-sm px-6 py-2.5">
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ══ 3. FAQ ════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="badge badge-cyan mb-4">FAQ</span>
            <h2 className="text-4xl font-extrabold"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              Common Questions
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left transition-all"
                    style={{ background: "transparent" }}
                  >
                    <span className="text-sm font-bold pr-4"
                      style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{
                        background: openFaq === i ? "var(--primary)" : "var(--bg-hover)",
                        color: openFaq === i ? "white" : "var(--fg-muted)",
                      }}>
                      +
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. CTA ═══════════════════════════════════════ */}
      <section className="pb-28 relative overflow-hidden bg-grid"
        style={{ background: "var(--bg)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <span className="badge badge-blue mb-6">
              <Headphones className="w-3 h-3" /> Still Need Help?
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              Browse Our<br />
              <span className="text-gradient">Product Range</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: "var(--fg-muted)", lineHeight: 1.8 }}>
              Find the right gear for your needs. All products come with a 2-year warranty
              and 30-day hassle-free returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="flex justify-center btn-primary px-8 py-3.5 text-base">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="flex justify-center btn-outline px-8 py-3.5 text-base">
                About Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}