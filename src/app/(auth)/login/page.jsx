"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!email)    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      toast.success("Welcome back! 🎉");
      router.push("/");
    } else {
      toast.error("Invalid credentials. Try password: password123");
      setErrors({ password: "Invalid email or password" });
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden mt-10 mb-15"
      style={{ paddingTop: "4rem" }}>
      {/* Orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="rounded-3xl p-8 sm:p-10"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem" }}>
                <span style={{ color: "var(--fg)" }}>VOLT</span>
                <span className="text-gradient"> STORE</span>
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-extrabold text-center mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
            Welcome Back
          </h1>
          <p className="text-sm text-center mb-8" style={{ color: "var(--fg-muted)" }}>
            Sign in to access your account
          </p>

          {/* Demo hint */}
          <div className="rounded-xl p-3 mb-6 text-xs text-center font-mono"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "var(--accent)" }}>
            Demo: any email + password <strong>password123</strong>
          </div>

          {/* Google */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm mb-4 transition-all hover:scale-[1.01]"
            style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--fg)", fontFamily: "var(--font-display)" }}>
            <Chrome className="w-5 h-5" style={{ color: "#4285f4" }} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>or with email</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5"
                style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-subtle)" }} />
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: "" })); }}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  style={{ borderColor: errors.email ? "var(--danger)" : undefined }}
                />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5"
                style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-subtle)" }} />
                <input
                  type={showPw ? "text" : "password"} value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: "" })); }}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  style={{ borderColor: errors.password ? "var(--danger)" : undefined }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--fg-subtle)" }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60">
              {loading ? "Signing in..." : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--fg-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "var(--primary)" }}>
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
