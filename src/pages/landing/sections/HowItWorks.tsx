import { Container, Row, Col } from "react-bootstrap";
import { useReveal } from "../../../hooks/useReveal";

const STEPS = [
  { n: 1, title: "Import Info", desc: "Connect your LinkedIn or upload your latest project files." },
  { n: 2, title: "Choose Design", desc: "Pick a style that matches your professional identity." },
  { n: 3, title: "Go Live", desc: "Deploy your custom portfolio to the world in seconds." },
] as const;

const HowItWorks = () => {
  const sectionRef = useReveal();
  return (
    <section id="how-it-works" ref={sectionRef as React.RefObject<HTMLElement>} className="how-section section-pad" aria-labelledby="hiw-heading">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={5} className="text-center">
            <p className="section-label reveal" style={{ justifyContent: "center", transitionDelay: "0s" }}>Process</p>
            <h2 id="hiw-heading" className="section-title reveal" style={{ transitionDelay: "0.08s" }}>Three Simple Steps</h2>
            <p className="section-subtitle mx-auto reveal" style={{ transitionDelay: "0.16s" }}>From zero to live portfolio in under 3 minutes.</p>
          </Col>
        </Row>

        <Row className="g-3 g-md-4 justify-content-center">
          {STEPS.map((s, i) => (
            <Col key={s.n} md={4} style={{ position: "relative" }}>
              <article className="step-card reveal-scale" style={{ transitionDelay: `${i * 0.13}s` }} aria-labelledby={`step-title-${s.n}`}>
                <div className="step-num-wrap" aria-hidden="true">
                  <div className="step-num">{s.n}</div>
                  <div className="step-ring" />
                  <div className="step-ring-outer" />
                </div>
                <h3 id={`step-title-${s.n}`} className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </article>
              {i < STEPS.length - 1 && (
                <div className="step-arrow d-none d-md-block" aria-hidden="true">→</div>
              )}
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;
