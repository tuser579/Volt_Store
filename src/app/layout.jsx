"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/Loading";

function LenisProvider({ children }) {
  useEffect(() => {
    let lenis;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    })();
    return () => lenis?.destroy();
  }, []);
  return <>{children}</>;
}

/* ── Paths where Navbar + Footer should be hidden ── */
const HIDE_LAYOUT_PATHS = ["/login", "/register", "/_not-found", "/not-found"];

/* ── Paths that skip the 2.2s loading screen ── */
const SKIP_LOADER_PATHS = ["/login", "/register", "/_not-found", "/not-found"];

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideLayout = HIDE_LAYOUT_PATHS.some(p => pathname?.startsWith(p));
  const skipLoader = SKIP_LOADER_PATHS.some(p => pathname?.startsWith(p));

  const [appReady, setAppReady] = useState(skipLoader);

  useEffect(() => {
    if (skipLoader) {
      setAppReady(true);
      return;
    }
    const t = setTimeout(() => setAppReady(true), 2200);
    return () => clearTimeout(t);
  }, [skipLoader]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Volt Store — Premium Electronics</title>
        <meta name="description" content="Shop premium headphones, earbuds, power banks & more at Volt Store." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
            <LenisProvider>

              {!appReady && <LoadingScreen />}

              <div
                style={{
                  opacity: appReady ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  pointerEvents: appReady ? "auto" : "none",
                }}
              >
                {!hideLayout && <Navbar />}
                <main>{children}</main>
                {!hideLayout && <Footer />}
              </div>

              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "var(--bg-card)",
                    color: "var(--fg)",
                    border: "1px solid var(--border)",
                    fontFamily: "var(--font-body)",
                  },
                  success: { iconTheme: { primary: "#22c55e", secondary: "white" } },
                  error:   { iconTheme: { primary: "#ef4444", secondary: "white" } },
                }}
              />
            </LenisProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}