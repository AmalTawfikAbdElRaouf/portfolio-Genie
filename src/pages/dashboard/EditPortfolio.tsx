import { useState, useEffect } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { FiEdit3, FiSave, FiArrowLeft, FiTrash2, FiEye } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getProjects } from "../../services/api";

const TEMPLATES = [
  { id: "modern", name: "Modern Minimalist", gradient: "linear-gradient(145deg,#1a1040,#0f0a2e)", accent: "#7C3AED" },
  { id: "vibrant", name: "Vibrant Agency", gradient: "linear-gradient(145deg,#241654,#3d1a8a)", accent: "#D2BBFF" },
  { id: "art", name: "Art Studio", gradient: "linear-gradient(145deg,#0f0a2e,#0f1f18)", accent: "#4EDEA3" },
];

const card: React.CSSProperties = {
  background: "rgba(26,16,60,0.7)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  color: "#fff",
  padding: "11px 14px",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  transition: "border-color 0.25s, box-shadow 0.25s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-muted-custom)",
  marginBottom: 6,
};

const EditPortfolio = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Live" as "Live" | "Draft",
    template: "modern",
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects();
        const found = data.find((p) => p.id === Number(id));
        if (!found) {
          Swal.fire({ title: "Not Found", text: "Portfolio not found.", icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
          navigate("/portfolios");
          return;
        }
        setForm({ name: found.name, description: found.description, status: found.status, template: "modern" });
      } catch {
        console.error("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Portfolio name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    Swal.fire({ title: "Saved!", text: "Portfolio updated successfully.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", timer: 1500, showConfirmButton: false });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Portfolio?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#7C3AED",
      confirmButtonText: "Yes, delete it!",
      background: "#1a1040",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) navigate("/portfolios");
    });
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <Spinner animation="border" style={{ color: "#7C3AED" }} />
    </div>
  );

  return (
    <div style={{ paddingTop: 8, paddingBottom: 120 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/portfolios")}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <FiArrowLeft size={18} />
          </button>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(1.2rem,3vw,1.6rem)", margin: 0 }}>Edit Portfolio</h2>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => Swal.fire("Preview", "Live preview coming soon!", "info")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            <FiEye size={16} /> Preview
          </button>
          <button
            onClick={handleDelete}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; }}
          >
            <FiTrash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <Form onSubmit={handleSave}>
        <Row className="g-4">
          <Col xs={12} lg={7}>
            <div style={card}>
              <h5 style={{ color: "#fff", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <FiEdit3 style={{ color: "var(--purple-main)" }} /> Portfolio Details
              </h5>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Portfolio Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({}); }}
                  style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "rgba(255,255,255,0.08)" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--purple-main)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.name ? "#ef4444" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
                {errors.name && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({}); }}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 100, borderColor: errors.description ? "#ef4444" : "rgba(255,255,255,0.08)" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--purple-main)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.description ? "#ef4444" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
                {errors.description && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4 }}>{errors.description}</p>}
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Status</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(["Live", "Draft"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, status: s })}
                      style={{
                        padding: "9px 28px", borderRadius: 12, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
                        border: form.status === s ? "none" : "1px solid rgba(255,255,255,0.15)",
                        background: form.status === s ? (s === "Live" ? "#10B981" : "#F59E0B") : "transparent",
                        color: form.status === s ? "#fff" : "rgba(255,255,255,0.5)",
                        transition: "all 0.2s",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                  padding: "13px 32px", borderRadius: 14, fontWeight: 700, fontSize: "0.9rem",
                  color: "#fff", background: "var(--purple-main)", border: "none",
                  cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1,
                  width: "100%", transition: "all 0.3s",
                }}
              >
                {saving ? <Spinner animation="border" size="sm" /> : <FiSave />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Col>

          <Col xs={12} lg={5}>
            <div style={card}>
              <h5 style={{ color: "#fff", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <BsStars style={{ color: "var(--purple-main)" }} /> Template
              </h5>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {TEMPLATES.map((t) => (
                  <div
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setForm({ ...form, template: t.id })}
                    onKeyDown={(e) => e.key === "Enter" && setForm({ ...form, template: t.id })}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                      borderRadius: 14, cursor: "pointer",
                      border: form.template === t.id ? "2px solid var(--purple-main)" : "1px solid rgba(255,255,255,0.08)",
                      background: form.template === t.id ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: t.gradient, flexShrink: 0, border: `2px solid ${t.accent}44` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</div>
                      {form.template === t.id && (
                        <span style={{ color: "var(--purple-main)", fontSize: "0.75rem" }}>✓ Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: 16, borderRadius: 14, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ color: "var(--text-muted-custom)", fontSize: "0.75rem", textAlign: "center", marginBottom: 10 }}>Live Preview</p>
                <div style={{ height: 140, background: TEMPLATES.find((t) => t.id === form.template)?.gradient, borderRadius: 12, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
                  <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{form.name || "Portfolio Name"}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginTop: 2 }}>
                      {form.description ? form.description.substring(0, 40) + "..." : "Description..."}
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, background: form.status === "Live" ? "#10B981" : "#F59E0B", color: "#fff" }}>
                    {form.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditPortfolio;
