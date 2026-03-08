"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.name)    e.name    = "Name is required";
    if (!form.email)   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Demo: sign in with credentials directly
    const res = await signIn("credentials", {
      email: form.email, password: "password123", redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      toast.success("Account created! Welcome to Volt Store 🎉");
      router.push("/");
    } else {
      toast.success("Account created! Please log in.");
      router.push("/login");
    }
  };

  const pwStrength = () => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 6)  s++;
    if (form.password.length >= 10) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  };
  const strength = pwStrength();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#06b6d4"][strength];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden mt-10 mb-10"
      style={{ paddingTop: "4rem", paddingBottom: "2rem" }}>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="rounded-3xl p-8 sm:p-10"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

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
            Create Account
          </h1>
          <p className="text-sm text-center mb-8" style={{ color: "var(--fg-muted)" }}>
            Join 50,000+ happy customers
          </p>

          <button onClick={() => signIn("google", { callbackUrl: "/" })}
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
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>
                FULL NAME
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-subtle)" }} />
                <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="John Doe" className="input-field pl-10"
                  style={{ borderColor: errors.name ? "var(--danger)" : undefined }} />
              </div>
              {errors.name && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-subtle)" }} />
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com" className="input-field pl-10"
                  style={{ borderColor: errors.email ? "var(--danger)" : undefined }} />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-subtle)" }} />
                <input type={showPw ? "text" : "password"} value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="••••••••" className="input-field pl-10 pr-10"
                  style={{ borderColor: errors.password ? "var(--danger)" : undefined }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-subtle)" }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: i <= strength ? strengthColor : "var(--border)" }} />
                    ))}
                  </div>
                  <p className="text-xs font-mono" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
              {errors.password && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-subtle)" }} />
                <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)}
                  placeholder="••••••••" className="input-field pl-10 pr-10"
                  style={{ borderColor: errors.confirm ? "var(--danger)" : undefined }} />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "var(--success)" }} />
                )}
              </div>
              {errors.confirm && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60">
              {loading ? "Creating account..." : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--fg-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "var(--primary)" }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
