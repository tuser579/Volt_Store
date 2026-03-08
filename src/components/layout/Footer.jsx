import Link from "next/link";
import { Zap, Github, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Headphones",   href: "/products?cat=Headphones" },
    { label: "Earbuds",      href: "/products?cat=Earbuds" },
    { label: "Power Banks",  href: "/products?cat=Power+Banks" },
  ],
  Company: [
    { label: "About Us", href: "/#about" },
    { label: "Deals",    href: "/#deals" },
    { label: "Blog",     href: "/#blog" },
    { label: "Careers",  href: "/#careers" },
  ],
  Support: [
    { label: "Help Center", href: "/#help" },
    { label: "Returns",     href: "/#returns" },
    { label: "Warranty",    href: "/#warranty" },
    { label: "Contact",     href: "/#contact" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem" }}>
                <span style={{ color: "var(--fg)" }}>VOLT</span>
                <span className="text-gradient"> STORE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "var(--fg-muted)" }}>
              Premium electronics for everyday life. Curated audio gear, chargers,
              and accessories trusted by 50,000+ customers.
            </p>
            {/* Social icons — no aria-label to avoid SSR mismatch */}
            <div className="flex gap-3">
              {[Github, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="/#social"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "var(--bg-hover)", color: "var(--fg-muted)" }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-widest"
                style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}>
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm link-underline"
                      style={{ color: "var(--fg-muted)" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--fg-subtle)", fontFamily: "var(--font-mono)" }}>
            © 2026 Volt Store. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(t => (
              <a key={t} href="/#legal" className="text-xs link-underline"
                style={{ color: "var(--fg-subtle)" }}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}