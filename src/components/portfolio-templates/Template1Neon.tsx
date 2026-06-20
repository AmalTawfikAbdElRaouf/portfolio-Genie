import { useState, useEffect, useRef } from "react";
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
  glassmorphism: boolean;
  themeMode?: "dark" | "light";
}

const THEMES = {
  dark: {
    bg: "#0a0816",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.06)",
    text: "#eae6f7",
    textMuted: "rgba(210,205,235,0.5)",
    textDim: "rgba(210,205,235,0.25)",
    divider: "rgba(255,255,255,0.04)",
  },
  light: {
    bg: "#f5f0fe",
    cardBg: "rgba(255,255,255,0.6)",
    cardBorder: "rgba(0,0,0,0.05)",
    text: "#1a1630",
    textMuted: "rgba(0,0,0,0.4)",
    textDim: "rgba(0,0,0,0.2)",
    divider: "rgba(0,0,0,0.04)",
  },
};

export default function Template1Neon({ data, projects, accent, glassmorphism, themeMode: outerTheme = "dark" }: Props) {
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
    <div ref={rootRef} style={{ position: "relative", background: t.bg, minHeight: "80vh", fontFamily: "'Inter', sans-serif" }} className="t1-root">
      <style>{`
        .t1-root .t1-topbar { padding: 20px 48px; }
        .t1-root .t1-nav { gap: 20px; }
        .t1-root .t1-hamburger { }
        .t1-root .t1-mobile-menu { display: none; }
        .t1-root .t1-hero { padding: 100px 48px 80px; }
        .t1-root .t1-hero-box { padding: 48px 56px; }
        .t1-root .t1-hero-inner { flex-direction: row; gap: 40px; }
        .t1-root .t1-initial { font-size: 4rem; }
        .t1-root .t1-section { padding: 60px 48px; }
        .t1-root .t1-contact { padding: 60px 48px; }
        .t1-root[data-view="tablet"] .t1-topbar,
        .t1-root[data-view="mobile"] .t1-topbar { padding: 12px 16px; }
        .t1-root[data-view="tablet"] .t1-hero,
        .t1-root[data-view="mobile"] .t1-hero { padding: 40px 12px 40px; }
        .t1-root[data-view="tablet"] .t1-hero-box,
        .t1-root[data-view="mobile"] .t1-hero-box { padding: 20px 16px; border-radius: 10px; }
        .t1-root[data-view="tablet"] .t1-hero-inner,
        .t1-root[data-view="mobile"] .t1-hero-inner { flex-direction: column; gap: 12px; }
        .t1-root[data-view="tablet"] .t1-initial,
        .t1-root[data-view="mobile"] .t1-initial { font-size: 2rem; }
        .t1-root[data-view="tablet"] .t1-section,
        .t1-root[data-view="mobile"] .t1-section { padding: 36px 12px; }
        .t1-root[data-view="tablet"] .t1-contact,
        .t1-root[data-view="mobile"] .t1-contact { padding: 36px 12px; }
        .t1-root[data-view="mobile"] .t1-topbar { flex-direction: row; gap: 0; align-items: center; }
      `}</style>
      <button onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
        style={{ position: "fixed", top: 12, right: 12, zIndex: 999, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${t.cardBorder}`, background: t.cardBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
        {themeMode === "dark" ? "☀️" : "🌙"}
      </button>

      {/* SIDE DECORATION */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${accent}, transparent 80%)`, zIndex: 1 }} />

      {/* WRAPPER */}
      <div style={{ marginLeft: 4 }}>

        {/* TOP BAR */}
        <div style={{ padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.divider}` }} className="t1-topbar">
          <div style={{ fontWeight: 700, fontSize: "0.82rem", color: t.text }}>
            {data.fullName?.split(" ")[0] || "Portfolio"}
          </div>
          <div style={{ display: isMobileView ? "none" : "flex", gap: "20px" }} className="t1-nav">
            {["About", "Work", "Projects", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={handleNavClick}
                style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 0", borderBottom: "2px solid transparent", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accent; (e.currentTarget as HTMLElement).style.borderBottomColor = accent; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = t.textMuted; (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}>
                {item}
              </a>
            ))}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="t1-hamburger"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: isMobileView ? "flex" : "none", flexDirection: "column", gap: "3px", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "18px", height: "2px", background: t.text, borderRadius: "2px", transition: "all 0.3s" }} />
            <div style={{ width: "18px", height: "2px", background: t.text, borderRadius: "2px", transition: "all 0.3s" }} />
            <div style={{ width: "18px", height: "2px", background: t.text, borderRadius: "2px", transition: "all 0.3s" }} />
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: t.bg, borderBottom: `1px solid ${t.divider}`, padding: "8px 16px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {["About", "Work", "Projects", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={handleNavClick}
                style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, padding: "8px 0", borderBottom: `1px solid ${t.divider}` }}>
                {item}
              </a>
            ))}
          </div>
        )}

        {/* HERO - Framed box layout */}
        <section id="about" style={{ padding: "100px 48px 80px", display: "flex", justifyContent: "center" }} className="t1-hero">
          <div style={{ maxWidth: "800px", width: "100%", border: `1px solid ${accent}25`, borderRadius: "20px", padding: "48px 56px", position: "relative", background: glassmorphism ? "rgba(255,255,255,0.02)" : "transparent" }} className="t1-hero-box">
            <div style={{ position: "absolute", top: -1, left: 40, width: 60, height: 2, background: accent }} />
            <div style={{ position: "absolute", bottom: -1, right: 40, width: 60, height: 2, background: accent }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: "40px" }} className="t1-hero-inner">
              <div style={{ fontSize: "4rem", fontWeight: 900, color: accent, lineHeight: 1, opacity: 0.3, fontFamily: "serif" }} className="t1-initial">
                {data.fullName ? data.fullName.charAt(0).toUpperCase() : "P"}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)", fontWeight: 800, color: t.text, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "8px", overflowWrap: "break-word", wordBreak: "break-word" }}>
                  {data.fullName || "Your Name"}
                </h1>
                <p style={{ fontSize: "0.9rem", color: accent, fontWeight: 600, marginBottom: "16px", letterSpacing: "0.02em" }}>
                  {data.title || "Your Title"}
                </p>
                <p style={{ fontSize: "0.82rem", color: t.textMuted, lineHeight: 1.85, marginBottom: "28px", maxWidth: "520px", overflowWrap: "break-word" }}>
                  {data.bio || "Your bio will appear here."}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {data.email && <a href={`mailto:${data.email}`} style={{ padding: "10px 24px", background: accent, color: "#fff", textDecoration: "none", borderRadius: "4px", fontWeight: 600, fontSize: "0.78rem" }}>Email</a>}
                  {data.github && <a href={data.github} target="_blank" rel="noreferrer" style={{ padding: "10px 24px", border: `1px solid ${t.cardBorder}`, color: t.textMuted, textDecoration: "none", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 500, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder; (e.currentTarget as HTMLElement).style.color = t.textMuted; }}>GitHub</a>}
                  {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" style={{ padding: "10px 24px", border: `1px solid ${t.cardBorder}`, color: t.textMuted, textDecoration: "none", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 500, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder; (e.currentTarget as HTMLElement).style.color = t.textMuted; }}>LinkedIn</a>}
                  {data.website && <a href={data.website} target="_blank" rel="noreferrer" style={{ padding: "10px 24px", border: `1px solid ${t.cardBorder}`, color: t.textMuted, textDecoration: "none", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 500, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder; (e.currentTarget as HTMLElement).style.color = t.textMuted; }}>Website</a>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        {data.skills.length > 0 && (
          <section style={{ padding: "60px 48px", borderTop: `1px solid ${t.divider}` }} className="t1-section">
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px" }}>Expertise</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
              {data.skills.map((skill, i) => (
                <div key={skill} style={{ padding: "18px 16px", background: glassmorphism ? "rgba(255,255,255,0.04)" : t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: "8px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: t.text, display: "block", marginBottom: "4px" }}>{skill}</span>
                  <span style={{ fontSize: "0.6rem", color: t.textDim }}>0{String(i + 1).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.experiences.length > 0 && (
          <section id="work" style={{ padding: "60px 48px", borderTop: `1px solid ${t.divider}` }} className="t1-section">
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "32px" }}>Experience</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {data.experiences.map((exp, idx) => (
                <div key={idx} style={{ padding: "24px", background: glassmorphism ? "rgba(255,255,255,0.04)" : t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: "10px", borderTop: `3px solid ${accent}`, transition: "all 0.25s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 30px ${accent}12`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <div style={{ fontSize: "0.72rem", color: accent, fontWeight: 700, marginBottom: "6px" }}>{exp.company}</div>
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: t.text, marginBottom: "6px" }}>{exp.title}</h3>
                  <p style={{ fontSize: "0.78rem", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section id="projects" style={{ padding: "60px 48px 80px", borderTop: `1px solid ${t.divider}` }} className="t1-section">
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "28px" }}>Projects</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {projects.map((proj, idx) => (
                <div key={idx}
                  style={{ background: glassmorphism ? "rgba(255,255,255,0.04)" : t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: "12px", overflow: "hidden", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${accent}20`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  {proj.imageUrl ? (
                    <img src={proj.imageUrl} alt={proj.title} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div style={{ height: "120px", background: `linear-gradient(135deg, ${accent}15, ${themeMode === "dark" ? "#0a0816" : "#f5f0fe"})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "2rem", color: accent, opacity: 0.4 }}>▣</span>
                    </div>
                  )}
                  <div style={{ padding: "18px" }}>
                    <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: t.text, marginBottom: "6px" }}>{proj.title}</h3>
                    <p style={{ fontSize: "0.78rem", color: t.textMuted, lineHeight: 1.7, marginBottom: "12px" }}>{proj.description}</p>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.75rem", color: accent, textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        View Project ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" style={{ padding: "60px 48px", borderTop: `1px solid ${t.divider}`, background: `${accent}04` }} className="t1-contact">
          <div style={{ maxWidth: "600px" }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: t.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>Let's talk</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: t.text, marginBottom: "8px", letterSpacing: "-0.03em" }}>Have a project?</h2>
            <p style={{ fontSize: "0.85rem", color: t.textMuted, marginBottom: "24px" }}>I'm always open to interesting work.</p>
            {data.email && (
              <a href={`mailto:${data.email}`} style={{ padding: "12px 32px", background: accent, color: "#fff", textDecoration: "none", borderRadius: "4px", fontWeight: 700, fontSize: "0.85rem", display: "inline-block" }}>
                Send a message
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
