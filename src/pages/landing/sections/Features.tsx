import { Container, Row, Col } from "react-bootstrap";
import { FiZap, FiFeather, FiEdit3 } from "react-icons/fi";
import { BsRocket } from "react-icons/bs";
import { useReveal } from "../../../hooks/useReveal";

const FEATURES = [
  { icon: <FiZap size={22} />, title: "Instant Creation", desc: "Our AI analyzes your work and automatically structures your content into high-converting layouts that highlight your best skills." },
  { icon: <FiFeather size={22} />, title: "Professional Templates", desc: "Choose from curated styles ranging from brutalist minimalism to high-end editorial agency layouts designed by award-winners." },
  { icon: <FiEdit3 size={22} />, title: "Easy Editing", desc: "No code, no stress. Our visual editor allows you to tweak every detail while the AI ensures your design maintains perfect proportions." },
  { icon: <BsRocket size={22} />, title: "Instant Sharing", desc: "Deploy to your own custom domain or use our blazing-fast global edge network to reach recruiters anywhere in milliseconds." },
] as const;

const Features = () => {
  const sectionRef = useReveal();
  return (
    <section id="features" ref={sectionRef as React.RefObject<HTMLElement>} className="features-section section-pad" aria-labelledby="features-heading">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={7} className="text-center">
            <p className="section-label reveal" style={{ justifyContent: "center", transitionDelay: "0s" }}>Why PortfolioAI</p>
            <h2 id="features-heading" className="section-title reveal" style={{ transitionDelay: "0.08s" }}>Everything you need to<br /><span style={{ color: "var(--muted)" }}>stand out from the crowd</span></h2>
          </Col>
        </Row>
        <Row className="g-3 g-md-4" role="list">
          {FEATURES.map((f, i) => (
            <Col key={f.title} sm={6} lg={3} role="listitem">
              <article className="feature-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} aria-labelledby={`feat-title-${i}`}>
                <div className="feature-card-corner" aria-hidden="true" />
                <div className="feature-icon" aria-hidden="true">{f.icon}</div>
                <h3 id={`feat-title-${i}`} className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;
