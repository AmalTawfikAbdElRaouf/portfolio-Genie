import { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FiFolder, FiCircle } from "react-icons/fi";
import type { RootState } from "../../../store";

function useCountUp(target: number, duration = 2000, active = false): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return count;
}

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const portfolios = useCountUp(10000, 2000, active);
  const live = useCountUp(6200, 2000, active);

  return (
    <section id="hero" aria-labelledby="hero-heading" className="hero-section">
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Animated background particles */}
      <div className="hero-particles" aria-hidden="true">
        <span className="hero-dot hero-dot-1" />
        <span className="hero-dot hero-dot-2" />
        <span className="hero-dot hero-dot-3" />
        <span className="hero-dot hero-dot-4" />
        <span className="hero-dot hero-dot-5" />
        <span className="hero-dot hero-dot-6" />
        <span className="hero-dot hero-dot-7" />
        <span className="hero-dot hero-dot-8" />
        <svg className="hero-ring-svg hero-ring-svg-1" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="rgba(124,58,237,0.25)" strokeWidth="1" strokeDasharray="8 6" />
          <circle cx="100" cy="100" r="60" stroke="rgba(124,58,237,0.12)" strokeWidth="1" />
        </svg>
        <svg className="hero-ring-svg hero-ring-svg-2" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="70" stroke="rgba(78,222,163,0.18)" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="80" cy="80" r="44" stroke="rgba(78,222,163,0.08)" strokeWidth="1" />
        </svg>
        <div className="hero-grid" />
      </div>

      <Container style={{ position: "relative", zIndex: 1 }}>
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <p className="hero-badge" aria-label="Creative Hub section">
              <span className="badge-dot" aria-hidden="true" />
              Creative Hub
            </p>

            <h1 id="hero-heading" className="hero-title">
              Build Your Professional
              <br />
              <span className="hero-title-gradient" aria-label="Portfolio.">
                Portfolio.
              </span>
            </h1>

            <p className="hero-subtitle">
              Elevate your digital presence with AI&#8209;driven curation. We
              transform your work into an editorial masterpiece in&nbsp;minutes,
              not days.
            </p>

            <div className="hero-actions">
              <a href={isLoggedIn ? "/portfolios/create" : "/signup"} className="btn-hero-primary" aria-label="Start creating your portfolio for free">
                <span aria-hidden="true">✦</span> Start Creating
              </a>
              <a href="#how-it-works" className="btn-hero-secondary" aria-label="Learn how PortfolioAI works">
                See How It Works <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className="hero-trust" aria-label="Key features overview">
              <span className="trust-check" aria-hidden="true">✓</span>
              <span>10K+ Portfolios Live</span>
              <span className="trust-sep" aria-hidden="true">•</span>
              <span className="trust-check" aria-hidden="true">✓</span>
              <span>3 Min Setup</span>
              <span className="trust-sep" aria-hidden="true">•</span>
              <span className="trust-check" aria-hidden="true">✓</span>
              <span>No code required</span>
            </p>

            <div className="hero-stats" ref={statsRef} aria-label="Platform statistics">
              <div className="stat-group">
                <div className="stat-icon" aria-hidden="true"><FiFolder size={18} /></div>
                <div className="stat-value" aria-live="polite" aria-label={`${portfolios.toLocaleString()} portfolios created`}>
                  {portfolios.toLocaleString()}+
                </div>
                <div className="stat-label">Total Portfolios Created</div>
              </div>
              <div style={{ width: 1, height: 48, background: "var(--border)", alignSelf: "center" }} aria-hidden="true" />
              <div className="stat-group">
                <div className="stat-icon green-bg" aria-hidden="true"><FiCircle size={18} fill="#4EDEA3" stroke="none" /></div>
                <div className="stat-value" aria-live="polite" aria-label={`${live.toLocaleString()} portfolios live right now`}>
                  {live.toLocaleString()}+
                </div>
                <div className="stat-label">Live Right Now</div>
              </div>
            </div>
          </Col>

          <Col lg={6} className="hero-visual-wrap">
            <div className="hero-visual" aria-hidden="true" role="presentation">
              <div className="hv-card-back2" />
              <div className="hv-card-back1" />

              <div className="float-tag float-tag-1">✦ AI Curating Layout…</div>
              <div className="float-tag float-tag-2">🚀 Published in 3&nbsp;min</div>

              <div className="hv-card hv-card-main">
                <div className="hv-hex">⬡</div>
                <div className="hv-title">AI Portfolio Engine</div>
                <div className="hv-sub">
                  Analyzing your work…
                  <br />
                  <span className="g">✓ Curating layout</span>
                </div>

                <div className="progress-track">
                  <div className="progress-fill-composited" />
                </div>

                <div className="hv-lines">
                  {[80, 62, 44].map((w, i) => (
                    <div key={i} className="hv-line" style={{ width: `${w}%`, height: i === 0 ? 9 : 6 }} />
                  ))}
                </div>
                <div className="hv-dots">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="hv-dot" />
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
