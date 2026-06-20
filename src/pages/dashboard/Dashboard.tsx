import { useEffect, useState } from "react";
import { Button, Row, Col, Spinner } from "react-bootstrap";
import { BsGlobe, BsFolderFill, BsStars, BsPencil } from "react-icons/bs";
import styles from "../../style/Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.user);
  const firstName = data.name ? data.name.split(" ")[0] : "User";

  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: portfoliosData, error } = await supabase
          .from("portfolios")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPortfolios(portfoliosData || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEdit = (portfolio: SavedPortfolio) => {
    dispatch(setPortfolioData(portfolio.portfolio_data));
    navigate("/portfolio-editor");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const recentPortfolios = portfolios.slice(0, 3);

  return (
    <div className={styles.dashboardWrapper}>
      {/* Welcome Card */}
      <div className={styles.welcomeModalCard}>
        <Row className="align-items-center">
          <Col xs={12} lg={9} className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>Welcome back, <span>{firstName}</span>!</h1>
            <p className={`${styles.welcomeText} mb-4`}>Your dashboard is ready. Keep up the great work and start a new project now!</p>
            <Button onClick={() => navigate("/portfolios/create")} className={`${styles.startBtn} d-inline-flex align-items-center gap-3`}>
              <BsStars size={24} />
              <span>Start Creating</span>
            </Button>
          </Col>
        </Row>
      </div>

      {/* Stats Row */}
      <Row className={`${styles.statsRow} g-3`}>
        {[
          { label: "TOTAL PORTFOLIOS", value: loading ? "..." : portfolios.length.toString(), icon: <BsFolderFill />, color: "#7C3AED" },
          { label: "LIVE ACTION", value: loading ? "..." : portfolios.length.toString(), icon: <BsGlobe />, color: "#10B981" },
        ].map((item, index) => (
          <Col key={index} xs={12} lg={6}>
            <div className={styles.statCard}>
              <div className={styles.dataContent}>
                <p className={styles.statLabel}>{item.label}</p>
                <h3 className={styles.statValue}>{item.value}</h3>
              </div>
              <div className={styles.iconWrapper} style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                {item.icon}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Projects Section */}
      <div className={styles.projectsSection}>
        <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
          <h2 className="text-white" style={{ fontSize: "1.4rem", fontWeight: "600" }}>Active Projects</h2>
          <span style={{ color: "#7C3AED", cursor: "pointer", fontSize: "0.9rem", whiteSpace: "nowrap" }} onClick={() => navigate("/portfolios")}>View all</span>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" style={{ color: "#7C3AED" }} />
          </div>
        ) : recentPortfolios.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📁</div>
            <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: "8px", fontSize: "1.1rem" }}>No portfolios yet</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "20px", fontSize: "0.9rem" }}>Create your first AI-powered portfolio</p>
            <button onClick={() => navigate("/portfolios/create")}
              style={{ padding: "10px 24px", background: "#7C3AED", border: "none", color: "#fff", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem" }}>
              Create Portfolio
            </button>
          </div>
        ) : (
          <Row className="g-3">
            {recentPortfolios.map((portfolio) => (
              <Col key={portfolio.id} xs={12} lg={4}>
                <div className={styles.projectCard}>
                  <div className={styles.projectImageWrapper} style={{ background: `linear-gradient(135deg, ${portfolio.accent}30, rgba(0,0,0,0.5))`, display: "flex", alignItems: "center", justifyContent: "center", height: "160px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "6px" }}>
                        {portfolio.template === 1 ? "🌑" : portfolio.template === 2 ? "☀️" : "⚡"}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: portfolio.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {portfolio.template === 1 ? "Neon Dark" : portfolio.template === 2 ? "Minimal Light" : "Creative Bold"}
                      </div>
                    </div>
                    <span className={styles.statusLive} style={{ position: "absolute", top: 12, left: 12 }}>Live</span>
                  </div>
                  <div className={styles.projectInfo}>
                    <div>
                      <h4 className={styles.projectName}>{portfolio.title}</h4>
                      <p className={styles.projectDesc}>{portfolio.portfolio_data?.title || "Portfolio"}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className={styles.projectDate}>{formatDate(portfolio.created_at)}</span>
                      <button className={styles.editBtn} onClick={() => handleEdit(portfolio)}>
                        <BsPencil className={styles.pencilIcon} />
                        <span className={styles.editText}>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Dashboard;