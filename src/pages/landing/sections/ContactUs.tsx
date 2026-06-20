import { useState, useId, type FormEvent } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiZap, FiGlobe, FiMessageCircle } from "react-icons/fi";
import { useReveal } from "../../../hooks/useReveal";

interface FormState { name: string; email: string; message: string; }
interface Errors { name?: string; email?: string; message?: string; }

const INFO_ITEMS = [
  { icon: <FiZap size={16} />, label: "AI-Powered Setup", sub: "Live in under 3 minutes" },
  { icon: <FiGlobe size={16} />, label: "Custom Domain", sub: "Free with any plan" },
  { icon: <FiMessageCircle size={16} />, label: "Dedicated Support", sub: "24/7 expert help" },
] as const;

function validateForm(form: FormState): Errors {
  const errs: Errors = {};
  if (!form.name.trim()) errs.name = "Full name is required";
  if (!form.email.trim()) errs.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email";
  if (!form.message.trim()) errs.message = "Message is required";
  return errs;
}

const ContactUs = () => {
  const sectionRef = useReveal();
  const uid = useId();
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 800);
  };

  return (
    <section id="contact-us" ref={sectionRef as React.RefObject<HTMLElement>} className="contact-section section-pad" aria-labelledby="contact-heading">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={6} className="text-center">
            <p className="section-label reveal" style={{ justifyContent: "center", transitionDelay: "0s" }}>Get In Touch</p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="contact-card reveal" style={{ transitionDelay: "0.08s" }}>
              <div className="contact-orb" aria-hidden="true" />
              <Row className="g-4 g-lg-5 align-items-start">
                <Col md={5} className="reveal-left" style={{ transitionDelay: "0.14s" }}>
                  <h2 id="contact-heading" className="section-title" style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)" }}>Ready to curate your story?</h2>
                  <p style={{ color: "var(--muted)", fontSize: "var(--text-sm)", lineHeight: 1.78, marginTop: "0.75rem" }}>
                    Drop us a line and our curation experts will help you get started.
                  </p>
                  {INFO_ITEMS.map((item) => (
                    <div key={item.label} className="contact-info-item">
                      <div className="info-icon" aria-hidden="true">{item.icon}</div>
                      <div>
                        <div className="info-label">{item.label}</div>
                        <div className="info-sub">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </Col>
                <Col md={7} className="reveal-right" style={{ transitionDelay: "0.2s" }}>
                  <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                    {status === "sent" && (
                      <div role="alert" aria-live="polite" style={{ background: "rgba(5,150,105,0.12)", border: "1px solid rgba(5,150,105,0.35)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "1rem", fontSize: "var(--text-sm)", color: "#4ade80", fontWeight: 600 }}>
                        ✓ Message sent! We'll get back to you within 24 hours.
                      </div>
                    )}
                    <Row className="g-3">
                      <Col sm={6}>
                        <label htmlFor={`${uid}-name`} className="form-label-custom">Full Name <span aria-label="required">*</span></label>
                        <input id={`${uid}-name`} className="form-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" autoComplete="name" aria-required="true" aria-invalid={!!errors.name} />
                        {errors.name && <p className="form-error" role="alert">⚠ {errors.name}</p>}
                      </Col>
                      <Col sm={6}>
                        <label htmlFor={`${uid}-email`} className="form-label-custom">Email Address <span aria-label="required">*</span></label>
                        <input id={`${uid}-email`} className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" autoComplete="email" aria-required="true" aria-invalid={!!errors.email} />
                        {errors.email && <p className="form-error" role="alert">⚠ {errors.email}</p>}
                      </Col>
                      <Col sm={12}>
                        <label htmlFor={`${uid}-msg`} className="form-label-custom">Message <span aria-label="required">*</span></label>
                        <textarea id={`${uid}-msg`} className="form-input" name="message" value={form.message} onChange={handleChange} placeholder="How can we help you stand out?" rows={5} aria-required="true" aria-invalid={!!errors.message} />
                        {errors.message && <p className="form-error" role="alert">⚠ {errors.message}</p>}
                      </Col>
                      <Col sm={12}>
                        <button type="submit" className={`btn-submit${status === "sent" ? " sent" : ""}`} disabled={status === "loading"} aria-disabled={status === "loading"} aria-live="polite">
                          {status === "loading" ? "Sending…" : status === "sent" ? "✓ Message Sent!" : "Send Message"}
                        </button>
                      </Col>
                    </Row>
                  </form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactUs;
