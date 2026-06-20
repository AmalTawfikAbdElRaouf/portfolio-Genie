import { Container, Row, Col } from "react-bootstrap";
import { useReveal } from "../../../hooks/useReveal";

interface Template {
  name: string;
  badge: string;
  badgeClass: "live" | "popular" | "new";
  filled: boolean;
  gradient: string;
  accent: string;
  hex: string;
  lineAlphas: [number, number, number];
}

const TEMPLATES: Template[] = [
  { name: "Modern Minimalist", badge: "LIVE", badgeClass: "live", filled: false, gradient: "linear-gradient(145deg,#1a1040,#0f0a2e)", accent: "#7C3AED", hex: "▣", lineAlphas: [0.5, 0.25, 0.12] },
  { name: "Vibrant Agency", badge: "POPULAR", badgeClass: "popular", filled: true, gradient: "linear-gradient(145deg,#241654,#3d1a8a)", accent: "#D2BBFF", hex: "◈", lineAlphas: [0.55, 0.28, 0.14] },
  { name: "Art Studio", badge: "NEW", badgeClass: "new", filled: false, gradient: "linear-gradient(145deg,#0f0a2e,#0f1f18)", accent: "#4EDEA3", hex: "◉", lineAlphas: [0.5, 0.25, 0.12] },
];

const Templates = () => {
  const sectionRef = useReveal();
  return (
    <section id="templates" ref={sectionRef as React.RefObject<HTMLElement>} className="templates-section section-pad" aria-labelledby="tpl-heading">
      <Container>
        <div className="d-flex justify-content-between align-items-end mb-4 mb-md-5">
          <div>
            <p className="section-label reveal" style={{ transitionDelay: "0s" }}>Canvas</p>
            <h2 id="tpl-heading" className="section-title reveal mb-0" style={{ transitionDelay: "0.08s" }}>Select your canvas</h2>
          </div>
          <a href="#" className="view-all-link d-none d-md-flex reveal" style={{ transitionDelay: "0.12s" }} aria-label="View all portfolio templates">
            View All Templates <span aria-hidden="true">→</span>
          </a>
        </div>

        <Row className="g-3 g-md-4" role="list">
          {TEMPLATES.map((t, i) => (
            <Col key={t.name} sm={6} lg={4} role="listitem">
              <article className="template-card reveal-scale" style={{ transitionDelay: `${i * 0.11}s` }} aria-labelledby={`tpl-name-${i}`}>
                <div className="tpl-preview" role="img" aria-label={`${t.name} template preview`}>
                  <div className="tpl-preview-inner" style={{ background: t.gradient }}>
                    <div className="tpl-hex" style={{ color: t.accent }} aria-hidden="true">{t.hex}</div>
                    <div className="tpl-mock-lines" aria-hidden="true">
                      {t.lineAlphas.map((a, j) => (
                        <div key={j} className="tpl-mock-line" style={{ background: `rgba(255,255,255,${a})`, width: `${[84, 64, 44][j]}%`, height: j === 0 ? 9 : 6 }} />
                      ))}
                    </div>
                    <div className="tpl-mock-dots" aria-hidden="true">
                      {[0, 1, 2].map((j) => (<div key={j} className="tpl-mock-dot" />))}
                    </div>
                  </div>
                  <div className="tpl-gradient-overlay" aria-hidden="true" />
                </div>
                <div className="tpl-body">
                  <span className={`tpl-badge ${t.badgeClass}`} aria-label={`Status: ${t.badge}`}>{t.badge}</span>
                  <p id={`tpl-name-${i}`} className="tpl-name">{t.name}</p>
                  <button className={`btn-preview${t.filled ? " btn-preview-filled" : ""}`} aria-label={`Preview ${t.name} template`} type="button">Preview</button>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Templates;
