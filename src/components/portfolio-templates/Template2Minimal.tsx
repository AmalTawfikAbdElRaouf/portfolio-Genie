import { useEffect, useState, useRef } from "react";
import type { PortfolioData } from "../../services/aiService";

interface ProjectWithImage {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

interface Props {
  data: PortfolioData;
  projects: ProjectWithImage[];
  accent: string;
  themeMode?: "dark" | "light";
}

const THEMES = {
  dark: {
    bg: "#12101a",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.06)",
    text: "#e2dfed",
    textMuted: "rgba(200,195,225,0.5)",
    textDim: "rgba(200,195,225,0.25)",
    divider: "rgba(255,255,255,0.05)",
  },
  light: {
    bg: "#fff",
    cardBg: "#f8f7fb",
    cardBorder: "rgba(0,0,0,0.05)",
    text: "#1d1b30",
    textMuted: "rgba(0,0,0,0.4)",
    textDim: "rgba(0,0,0,0.2)",
    divider: "rgba(0,0,0,0.04)",
  },
};

export default function Template2Minimal({ data, projects, accent, themeMode: outerTheme = "light" }: Props) {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(outerTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = THEMES[themeMode];
  useEffect(() => { setThemeMode(outerTheme); }, [outerTheme]);

  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const isMobileView = view === "mobile";

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = (w: number) => {
      const v = w < 480 ? "mobile" : w < 768 ? "tablet" : "desktop";
      setView(v);
      el.dataset.view = v;
    };
    update(el.offsetWidth);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) update(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <div ref={rootRef} style={{ position: "relative", background: t.bg, minHeight: "80vh", fontFamily: "'Inter', sans-serif", color: t.text }} className="t2-root">
      <style>{`
        .t2-root .t2-topbar { padding: 14px 40px; }
        .t2-root .t2-nav { gap: 20px; }
        .t2-root .t2-hamburger { }
        .t2-root .t2-mobile-menu { display: none; }
        .t2-root .t2-hero { padding: 80px 40px 60px; gap: 24px; flex-direction: row; }
        .t2-root .t2-hero-bar { display: block; }
        .t2-root .t2-section { padding: 60px 40px; }
        .t2-root .t2-section-sm { padding: 40px; }
        .t2-root .t2-contact { padding: 60px 40px; }
        .t2-root .t2-footer { padding: 30px 40px; }
        .t2-root[data-view="tablet"] .t2-topbar,
        .t2-root[data-view="mobile"] .t2-topbar { padding: 10px 16px; }
        .t2-root[data-view="tablet"] .t2-hero,
        .t2-root[data-view="mobile"] .t2-hero { padding: 40px 16px 36px; gap: 14px; flex-direction: column; }
        .t2-root[data-view="tablet"] .t2-hero-bar,
        .t2-root[data-view="mobile"] .t2-hero-bar { display: none; }
        .t2-root[data-view="tablet"] .t2-section,
        .t2-root[data-view="mobile"] .t2-section { padding: 36px 16px; }
        .t2-root[data-view="tablet"] .t2-section-sm,
        .t2-root[data-view="mobile"] .t2-section-sm { padding: 20px 16px; }
        .t2-root[data-view="tablet"] .t2-contact,
        .t2-root[data-view="mobile"] .t2-contact { padding: 36px 16px; }
        .t2-root[data-view="tablet"] .t2-footer,
        .t2-root[data-view="mobile"] .t2-footer { padding: 16px; }
      `}</style>
      <button onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
        style={{ position: "fixed", top: 12, right: 12, zIndex: 999, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${t.cardBorder}`, background: t.cardBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
        {themeMode === "dark" ? "☀️" : "🌙"}
      </button>

      {/* TOP BAR */}
      <div style={{ padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.divider}` }} className="t2-topbar">
        <div style={{ fontWeight: 700, fontSize: "0.82rem", color: t.text }}>
          {data.fullName?.split(" ")[0] || "Portfolio"}
        </div>
        <div style={{ display: isMobileView ? "none" : "flex", gap: "20px" }} className="t2-nav">
          {["About", "Work", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={handleNavClick}
              style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.72rem", fontWeight: 500 }}>
              {item}
            </a>
          ))}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="t2-hamburger"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: isMobileView ? "flex" : "none", flexDirection: "column", gap: "3px", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "18px", height: "2px", background: t.text, borderRadius: "2px" }} />
          <div style={{ width: "18px", height: "2px", background: t.text, borderRadius: "2px" }} />
          <div style={{ width: "18px", height: "2px", background: t.text, borderRadius: "2px" }} />
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: t.bg, borderBottom: `1px solid ${t.divider}`, padding: "8px 16px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {["About", "Work", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={handleNavClick}
              style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.8rem", fontWeight: 500, padding: "8px 0", borderBottom: `1px solid ${t.divider}` }}>
              {item}
            </a>
          ))}
        </div>
      )}

      {/* HERO - Left aligned with vertical accent bar */}
      <section id="about" style={{ padding: "80px 40px 60px", borderBottom: `1px solid ${t.divider}`, display: "flex", gap: "24px", alignItems: "flex-start" }} className="t2-hero">
        <div style={{ width: "3px", height: "100px", background: `linear-gradient(180deg, ${accent}, ${accent}10)`, borderRadius: "2px", flexShrink: 0, marginTop: "8px" }} className="t2-hero-bar" />
        <div style={{ maxWidth: "520px" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 5vw, 3.5rem)", fontWeight: 300, color: t.text, letterSpacing: "-0.04em", marginBottom: "6px", lineHeight: 1.1, overflowWrap: "break-word", wordBreak: "break-word" }}>
            {data.fullName || "Your Name"}
          </h1>
          <p style={{ fontSize: "0.85rem", color: accent, fontWeight: 500, marginBottom: "20px", letterSpacing: "0.02em" }}>
            {data.title || "Your Title"}
          </p>
          <p style={{ fontSize: "0.82rem", color: t.textMuted, lineHeight: 1.9, marginBottom: "28px", overflowWrap: "break-word" }}>
            {data.bio || "Your bio will appear here."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {data.email && <a href={`mailto:${data.email}`} style={{ padding: "9px 22px", background: themeMode === "dark" ? accent : "transparent", color: themeMode === "dark" ? "#fff" : accent, textDecoration: "none", border: `1px solid ${accent}`, borderRadius: "3px", fontSize: "0.78rem", fontWeight: 600 }}>Contact me</a>}
            {data.github && <a href={data.github} target="_blank" rel="noreferrer" style={{ padding: "9px 22px", border: `1px solid ${t.cardBorder}`, color: t.textMuted, textDecoration: "none", borderRadius: "3px", fontSize: "0.78rem", fontWeight: 500 }}>GitHub</a>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" style={{ padding: "9px 22px", border: `1px solid ${t.cardBorder}`, color: t.textMuted, textDecoration: "none", borderRadius: "3px", fontSize: "0.78rem", fontWeight: 500 }}>LinkedIn</a>}
            {data.website && <a href={data.website} target="_blank" rel="noreferrer" style={{ padding: "9px 22px", border: `1px solid ${t.cardBorder}`, color: t.textMuted, textDecoration: "none", borderRadius: "3px", fontSize: "0.78rem", fontWeight: 500 }}>Website</a>}
          </div>
        </div>
      </section>

      {/* WORK / EXPERIENCE */}
      {data.experiences.length > 0 && (
        <section id="work" style={{ padding: "60px 40px", borderBottom: `1px solid ${t.divider}` }} className="t2-section">
          <div style={{ maxWidth: "680px" }}>
            <div style={{ fontSize: "0.55rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "28px" }}>Work</div>
            {data.experiences.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: idx < data.experiences.length - 1 ? "24px" : 0, paddingLeft: "20px", borderLeft: `2px solid ${idx < data.experiences.length - 1 ? `${accent}30` : accent}`, position: "relative" }}>
                <div style={{ position: "absolute", left: -5, top: 0, width: 8, height: 8, borderRadius: "50%", background: accent }} />
                <div style={{ fontSize: "0.72rem", color: t.textDim, fontWeight: 600, marginBottom: "4px" }}>{exp.company}</div>
                <h3 style={{ fontSize: "0.88rem", fontWeight: 600, color: t.text, marginBottom: "4px" }}>{exp.title}</h3>
                <p style={{ fontSize: "0.78rem", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {data.skills.length > 0 && (
        <section id="skills" style={{ padding: "40px", borderBottom: `1px solid ${t.divider}` }} className="t2-section-sm">
          <div style={{}}>
            <div style={{ fontSize: "0.55rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {data.skills.map((skill, idx) => (
                <span key={skill} style={{ fontSize: "0.75rem", color: t.textMuted, padding: "3px 0" }}>
                  {skill}{idx < data.skills.length - 1 ? <span style={{ color: accent, marginLeft: "6px", opacity: 0.3 }}>|</span> : ""}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "50px 40px 60px", borderTop: `1px solid ${t.divider}` }} className="t2-section">
          <div style={{}}>
            <div style={{ fontSize: "0.55rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px" }}>Projects</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: "8px", overflow: "hidden", transition: "all 0.25s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${accent}10`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  {proj.imageUrl ? (
                    <img src={proj.imageUrl} alt={proj.title} style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div style={{ height: "90px", background: `linear-gradient(135deg, ${accent}08, ${themeMode === "dark" ? "#12101a" : "#f0ecf7"})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "1.5rem", color: accent, opacity: 0.3 }}>◇</span>
                    </div>
                  )}
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "0.82rem", fontWeight: 600, color: t.text, marginBottom: "4px" }}>{proj.title}</h3>
                    <p style={{ fontSize: "0.72rem", color: t.textMuted, lineHeight: 1.6, marginBottom: "10px" }}>{proj.description}</p>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.7rem", color: accent, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>View ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" style={{ padding: "60px 40px", borderTop: `1px solid ${t.divider}`, textAlign: "center" }} className="t2-contact">
        <div style={{}}>
          <div style={{ fontSize: "0.55rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>Get in touch</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 500, color: t.text, marginBottom: "24px", letterSpacing: "-0.02em" }}>Have a project or just want to say hi?</h2>
          {data.email && (
            <a href={`mailto:${data.email}`} style={{ padding: "12px 36px", background: accent, color: "#fff", textDecoration: "none", borderRadius: "4px", fontWeight: 600, fontSize: "0.85rem", display: "inline-block", letterSpacing: "0.02em" }}>
              Send a message
            </a>
          )}
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
            {data.github && <a href={data.github} target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: t.textMuted, textDecoration: "none", fontWeight: 500 }}>GitHub</a>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: t.textMuted, textDecoration: "none", fontWeight: 500 }}>LinkedIn</a>}
            {data.website && <a href={data.website} target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: t.textMuted, textDecoration: "none", fontWeight: 500 }}>Website</a>}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ padding: "30px 40px", borderTop: `1px solid ${t.divider}`, textAlign: "center", fontSize: "0.7rem", color: t.textDim }} className="t2-footer">
        &copy; {data.fullName || "Portfolio"} — {new Date().getFullYear()}
      </div>
    </div>
  );
}
