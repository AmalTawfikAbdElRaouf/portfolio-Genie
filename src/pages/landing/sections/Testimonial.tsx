import { Container, Row, Col } from "react-bootstrap";
import { useReveal } from "../../../hooks/useReveal";

interface Testimonial {
  stars: number;
  text: string;
  name: string;
  role: string;
  initials: string;
  gradFrom: string;
  gradTo: string;
}

const TESTIMONIALS: Testimonial[] = [
  { stars: 5, text: '"PortfolioAI completely changed how I present my design work. The AI curation felt like having a personal agent."', name: "Sara M.", role: "Product Designer", initials: "SM", gradFrom: "#7C3AED", gradTo: "#4EDEA3" },
  { stars: 4, text: '"The editorial feel is unmatched. I landed my senior role at an agency within two weeks of launching my new site."', name: "Ahmed K.", role: "Senior Architect", initials: "AK", gradFrom: "#4EDEA3", gradTo: "#7C3AED" },
  { stars: 5, text: '"I love how minimal it is. It doesn\'t distract from the work. It frames it perfectly like a digital gallery."', name: "Nour A.", role: "Photographer", initials: "NA", gradFrom: "#D2BBFF", gradTo: "#7C3AED" },
];

const Testimonial = () => {
  const sectionRef = useReveal();
  return (
    <section id="testimonial" ref={sectionRef as React.RefObject<HTMLElement>} className="testimonials-section section-pad" aria-labelledby="testi-heading">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={6} className="text-center">
            <p className="section-label reveal" style={{ justifyContent: "center", transitionDelay: "0s" }}>Social Proof</p>
            <h2 id="testi-heading" className="section-title reveal" style={{ transitionDelay: "0.08s" }}>Loved by world-class curators</h2>
          </Col>
        </Row>
        <Row className="g-3 g-md-4">
          {TESTIMONIALS.map((t, i) => (
            <Col key={t.name} sm={12} md={4}>
              <figure className="testi-card reveal-scale" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="testi-stars" role="img" aria-label={`${t.stars} out of 5 stars`}>
                  {"★".repeat(t.stars)}
                  {"☆".repeat(5 - t.stars)}
                </div>
                <blockquote className="testi-text">{t.text}</blockquote>
                <figcaption className="testi-author">
                  <div className="testi-avatar" aria-hidden="true" style={{ background: `linear-gradient(135deg,${t.gradFrom},${t.gradTo})` }}>{t.initials}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonial;
