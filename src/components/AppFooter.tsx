import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import styles from "../style/AppFooter.module.css";

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Platform: [
    { label: "Features", href: "/#features" },
    { label: "Templates", href: "/#templates" },
    { label: "Integrations", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Our Story", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const SOCIALS = [
  { icon: "𝕏", label: "X (formerly Twitter)", href: "#" },
  { icon: "in", label: "LinkedIn", href: "#" },
  { icon: "◎", label: "Instagram", href: "#" },
  { icon: "⬡", label: "GitHub", href: "#" },
];

const DASHBOARD_ROUTES = ["/dashboard", "/portfolios", "/portfolio-editor", "/settings"];

const AppFooter = () => {
  const year = new Date().getFullYear();
  const location = useLocation();
  const isDashboard = DASHBOARD_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + "/")
  );

  return (
    <footer
      className={`${styles.footerSection}${isDashboard ? " " + styles.dashboardFooter : ""}`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container>
        <Row className="g-4 g-lg-5">
          <Col lg={4} md={12}>
            <Link to="/" className={styles.brandLogo} aria-label="portfolioGenie — go to home">
              portfolio<span className={styles.footerAitext}>Genie</span>
              <span className={styles.brandDot} aria-hidden="true" />
            </Link>
            <p className={styles.footerBrandDesc}>
              Empowering designers and developers to build AI-curated portfolios with the click of a button.
            </p>
            <ul className={styles.footerSocialsList} aria-label="Social media links">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className={styles.socialBtn}
                    aria-label={s.label}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span aria-hidden="true">{s.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <Col key={heading} lg={2} sm={6}>
              <h3 className={styles.footerHeading}>{heading}</h3>
              <nav aria-label={`${heading} links`}>
                <ul className={styles.footerLinkList}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={styles.footerLink}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Col>
          ))}

          <Col lg={4} sm={12}>
            <h3 className={styles.footerHeading}>Newsletter</h3>
            <p className={styles.newsletterDesc}>
              Get the latest updates from our team.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter subscription"
            >
              <div className={styles.newsletterRow}>
                <label htmlFor="newsletter-email" className={styles.visuallyHidden}>
                  Email address for newsletter
                </label>
                <input
                  id="newsletter-email"
                  className={styles.newsletterInput}
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className={styles.newsletterBtn}
                  aria-label="Subscribe to newsletter"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </Col>
        </Row>

        <hr className={styles.footerDivider} />
        <p className={styles.footerCopy}>
          &copy; {year} PORTFOLIOGENIE. ALL RIGHTS RESERVED.
        </p>
      </Container>
    </footer>
  );
};

export default AppFooter;
