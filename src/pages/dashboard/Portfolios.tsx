import { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { BsPencil, BsTrash3, BsEye, BsPlusLg } from "react-icons/bs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import { setPortfolioData } from "../../store/slices/portfolioSlice";

interface SavedPortfolio {
  id: string;
  title: string;
  template: number;
  accent: string;
  portfolio_data: any;
  created_at: string;
}

const Portfolios = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch {
      Swal.fire("Error", "Failed to load portfolios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (portfolio: SavedPortfolio) => {
    dispatch(setPortfolioData(portfolio.portfolio_data));
    navigate("/portfolio-editor");
  };

  const handleDelete = (id: string, title: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${title}"? This can't be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#7C3AED",
      confirmButtonText: "Yes, delete it!",
      background: "#1a1040",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("portfolios").delete().eq("id", id);
        if (error) {
          Swal.fire("Error", "Failed to delete portfolio.", "error");
          return;
        }
        setPortfolios((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({ title: "Deleted!", text: "Portfolio removed.", icon: "success", background: "#1a1040", color: "#fff", confirmButtonColor: "#7C3AED", timer: 1400, showConfirmButton: false });
      }
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div style={{ paddingTop: 8, paddingBottom: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
        <div>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(1.3rem,3vw,1.8rem)", margin: 0 }}>My Portfolios</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", margin: "4px 0 0" }}>
            {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => navigate("/portfolios/create")}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 14, background: "var(--purple-main)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 0 24px rgba(124,58,237,0.35)", transition: "all 0.25s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
          <BsPlusLg /> New Portfolio
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" style={{ color: "#7C3AED" }} />
        </div>
      ) : portfolios.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📁</div>
          <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: "8px" }}>No portfolios yet</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Create your first AI-powered portfolio</p>
          <button onClick={() => navigate("/portfolios/create")}
            style={{ padding: "12px 28px", background: "#7C3AED", border: "none", color: "#fff", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            Create Portfolio
          </button>
        </div>
      ) : (
        <Row className="g-3">
          {portfolios.map((portfolio) => (
            <Col key={portfolio.id} xs={12} sm={6} lg={4}>
              <div
                style={{ background: "rgba(26,16,60,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(124,58,237,0.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}>

                {/* Preview Header */}
                <div style={{ height: 140, background: `linear-gradient(135deg, ${portfolio.accent}30, rgba(0,0,0,0.5))`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: `2px solid ${portfolio.accent}40` }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                      {portfolio.template === 1 ? "🌑" : portfolio.template === 2 ? "☀️" : "⚡"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: portfolio.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {portfolio.template === 1 ? "Neon Dark" : portfolio.template === 2 ? "Minimal Light" : "Creative Bold"}
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 8px #4edea3" }} />
                </div>

                <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h5 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", margin: "0 0 4px" }}>{portfolio.title}</h5>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", margin: 0 }}>
                      {portfolio.portfolio_data?.title || "Portfolio"}
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>{formatDate(portfolio.created_at)}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { icon: <BsEye size={14} />, title: "View", onClick: () => handleEdit(portfolio), danger: false },
                        { icon: <BsPencil size={14} />, title: "Edit", onClick: () => handleEdit(portfolio), danger: false },
                        { icon: <BsTrash3 size={14} />, title: "Delete", onClick: () => handleDelete(portfolio.id, portfolio.title), danger: true },
                      ].map((btn, i) => (
                        <button key={i} title={btn.title} onClick={btn.onClick}
                          style={{ width: 34, height: 34, borderRadius: 8, border: btn.danger ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(255,255,255,0.1)", background: btn.danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)", color: btn.danger ? "#ef4444" : "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = btn.danger ? "rgba(239,68,68,0.18)" : "rgba(124,58,237,0.15)"; (e.currentTarget as HTMLButtonElement).style.borderColor = btn.danger ? "rgba(239,68,68,0.5)" : "#7C3AED"; (e.currentTarget as HTMLButtonElement).style.color = btn.danger ? "#ef4444" : "#7C3AED"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = btn.danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = btn.danger ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = btn.danger ? "#ef4444" : "rgba(255,255,255,0.5)"; }}>
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Portfolios;