"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ImageIcon, DollarSign, Tag, FileText, AlignLeft, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Headphones", "Earbuds", "Power Banks", "Neckbands", "Chargers", "Speakers", "Gaming"];

const FIELD = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5 uppercase tracking-wider"
      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-display)" }}>
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </label>
    {children}
    {error && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{error}</p>}
  </div>
);

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const [form, setForm] = useState({
    title: "", shortDescription: "", description: "",
    price: "", category: "Headphones", imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.shortDescription.trim()) e.shortDescription = "Short description is required";
    if (!form.description.trim()) e.description = "Full description is required";
    if (!form.price) e.price = "Price is required";
    else if (isNaN(form.price) || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (form.imageUrl && !/^https?:\/\//.test(form.imageUrl)) e.imageUrl = "Must be a valid URL";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    // await new Promise(r => setTimeout(r, 1200)); // simulate API
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (res.ok) {
      setLoading(false);
      setTimeout(() => {
        setForm({ title: "", shortDescription: "", description: "", price: "", category: "Headphones", imageUrl: "" });
        setSubmitted(false);
      }, 1000);
      toast.success("Product added successfully! 🎉");
      router.push("/dashboard/manage-products");
    } else {
      setLoading(false);
      setSubmitted(true);
      toast.error(result.error || "Failed to create product");
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "5rem" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen" style={{ paddingTop: "5rem" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-15">

        {/* Header */}
        <div className="mb-10 flex flex-col items-center">
          <h1 className="text-center mx-auto text-3xl sm:text-4xl font-extrabold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
            Add New Product
          </h1>
          <p className="text-center text-sm" style={{ color: "var(--fg-muted)" }}>
            Logged in as <span style={{ color: "var(--accent)" }}>{session?.user?.email}</span>
          </p>
        </div>

        {/* Success state */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-3xl mb-8"
            style={{ background: "var(--bg-card)", border: "1px solid var(--success)" }}>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--success)" }} />
            <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}>
              Product Added!
            </h2>
            <p style={{ color: "var(--fg-muted)" }}>Your product has been listed successfully.</p>
          </motion.div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit}>
            <div className="rounded-3xl p-6 sm:p-8 space-y-6"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

              <FIELD label="Product Title" icon={Tag} error={errors.title}>
                <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="e.g. SonicX Pro Headphones"
                  className="input-field"
                  style={{ borderColor: errors.title ? "var(--danger)" : undefined }} />
              </FIELD>

              <FIELD label="Short Description" icon={FileText} error={errors.shortDescription}>
                <input type="text" value={form.shortDescription}
                  onChange={e => set("shortDescription", e.target.value)}
                  placeholder="One-line summary shown in product cards (max 120 chars)"
                  className="input-field"
                  style={{ borderColor: errors.shortDescription ? "var(--danger)" : undefined }} />
                <p className="text-xs mt-1 text-right font-mono"
                  style={{ color: form.shortDescription.length > 100 ? "var(--warning)" : "var(--fg-subtle)" }}>
                  {form.shortDescription.length}/120
                </p>
              </FIELD>

              <FIELD label="Full Description" icon={AlignLeft} error={errors.description}>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  placeholder="Detailed product description..."
                  rows={5}
                  className="input-field resize-none"
                  style={{ borderColor: errors.description ? "var(--danger)" : undefined }} />
              </FIELD>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FIELD label="Price (USD)" icon={DollarSign} error={errors.price}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold"
                      style={{ color: "var(--fg-muted)" }}>$</span>
                    <input type="number" min="0" step="0.01" value={form.price}
                      onChange={e => set("price", e.target.value)}
                      placeholder="99.99"
                      className="input-field pl-7"
                      style={{ borderColor: errors.price ? "var(--danger)" : undefined }} />
                  </div>
                </FIELD>

                <FIELD label="Category">
                  <select value={form.category} onChange={e => set("category", e.target.value)}
                    className="input-field" style={{ background: "var(--bg-hover)" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FIELD>
              </div>

              <FIELD label="Image URL (Optional)" icon={ImageIcon} error={errors.imageUrl}>
                <input type="url" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                  style={{ borderColor: errors.imageUrl ? "var(--danger)" : undefined }} />
                {form.imageUrl && !errors.imageUrl && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden"
                    style={{ border: "1px solid var(--border)" }}>
                    <img src={form.imageUrl} alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => e.target.style.display = "none"} />
                  </div>
                )}
              </FIELD>

              <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <button type="submit" disabled={loading}
                  className="btn-primary flex-1 sm:flex-none px-8 py-3.5 justify-center disabled:opacity-60">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding Product...</>
                    : <><Plus className="w-4 h-4" /> Add Product</>}
                </button>
                <button type="button"
                  onClick={() => { setForm({ title: "", shortDescription: "", description: "", price: "", category: "Headphones", imageUrl: "" }); setErrors({}); }}
                  className="btn-outline px-6 py-3.5">
                  Reset
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
