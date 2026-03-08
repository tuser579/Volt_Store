"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Menu, X, Sun, Moon, ChevronDown,
  Settings, LogOut, Plus, ShoppingBag
} from "lucide-react";

const navLinks = [
  { label: "Home",     href: "/"         },
  { label: "Products", href: "/products" },
  { label: "About",    href: "/about"    },
  { label: "Contact",  href: "/contact"  },
];

export default function Navbar() {
  const { data: session }           = useSession();
  const { theme, setTheme }         = useTheme();
  const pathname                    = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const dropRef                     = useRef(null);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]);
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem" }}>
              <span style={{ color: "var(--fg)" }}>VOLT</span>
              <span className="text-gradient"> STORE</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => {
              const active  = isActive(l.href);
              const hovered = hoveredLink === l.label;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onMouseEnter={() => setHoveredLink(l.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: active
                      ? "white"
                      : hovered
                        ? "var(--fg)"
                        : "var(--fg-muted)",
                    background: active
                      ? "linear-gradient(135deg, var(--primary), var(--accent))"
                      : hovered
                        ? "var(--bg-hover)"
                        : "transparent",
                    boxShadow: active
                      ? "0 0 16px var(--primary-glow)"
                      : "none",
                  }}
                >
                  {l.label}

                  {/* Hover underline — only for non-active links */}
                  {!active && (
                    <span
                      className="absolute bottom-1 left-4 right-4 h-px transition-all duration-250"
                      style={{
                        background: "var(--primary)",
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ background: "var(--bg-hover)", color: "var(--fg-muted)" }}
              >
                {theme === "dark"
                  ? <Sun  className="w-4 h-4" />
                  : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Auth — logged in */}
            {session ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
                  style={{
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
                  >
                    {session.user?.image
                      ? <img src={session.user.image} className="w-full h-full object-cover" alt="" />
                      : initials}
                  </div>
                  <span
                    className="text-sm hidden sm:block font-semibold"
                    style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}
                  >
                    {session.user?.name?.split(" ")[0] ?? "User"}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--fg-muted)" }}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        zIndex: 100,
                      }}
                    >
                      {/* User info */}
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                        <p className="text-xs font-bold truncate"
                          style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}>
                          {session.user?.name ?? "User"}
                        </p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--fg-muted)" }}>
                          {session.user?.email}
                        </p>
                      </div>

                      {/* Dropdown links */}
                      {[
                        { icon: Plus,        label: "Add Product",     href: "/dashboard/add-product"     },
                        { icon: Settings,    label: "Manage Products", href: "/dashboard/manage-products" },
                        // { icon: ShoppingBag, label: "All Products",    href: "/products"                  },
                      ].map(({ icon: Icon, label, href }) => {
                        const itemActive = pathname === href;
                        return (
                          <Link
                            key={label}
                            href={href}
                            onClick={() => setDropOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-white/5"
                            style={{
                              color: itemActive ? "var(--primary)" : "var(--fg-muted)",
                              background: itemActive ? "var(--primary-glow)" : "transparent",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                            {label}
                            {itemActive && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full"
                                style={{ background: "var(--primary)" }} />
                            )}
                          </Link>
                        );
                      })}

                      {/* Sign out */}
                      <div style={{ borderTop: "1px solid var(--border)" }}>
                        <button
                          onClick={() => { signOut({ callbackUrl: "/" }); setDropOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm w-full transition-all hover:opacity-80"
                          style={{ color: "var(--danger)" }}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login"    className="btn-outline text-sm px-4 py-2">Login</Link>
                <Link href="/register" className="btn-primary  text-sm px-4 py-2">Register</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ background: "var(--bg-hover)", color: "var(--fg)" }}
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden"
            style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: active ? "white" : "var(--fg-muted)",
                      background: active
                        ? "linear-gradient(135deg, var(--primary), var(--accent))"
                        : "transparent",
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}

              {!session && (
                <div className="flex gap-2 pt-3 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <Link href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline text-sm flex-1 justify-center py-2.5">
                    Login
                  </Link>
                  <Link href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary text-sm flex-1 justify-center py-2.5">
                    Register
                  </Link>
                </div>
              )}

              {/* {session && (
                <div className="flex flex-col gap-1 pt-3 mt-2"
                  style={{ borderTop: "1px solid var(--border)" }}>
                  {[
                    { label: "Add Product",     href: "/dashboard/add-product"     },
                    { label: "Manage Products", href: "/dashboard/manage-products" },
                  ].map(({ label, href }) => {
                    const active = pathname === href;
                    return (
                      <Link key={label} href={href}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: active ? "var(--primary)" : "var(--fg-muted)",
                          background: active ? "var(--primary-glow)" : "transparent",
                        }}>
                        {label}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-left"
                    style={{ color: "var(--danger)", fontFamily: "var(--font-display)" }}>
                    Sign Out
                  </button>
                </div>
              )} */}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}