import { useEffect, useRef, useState } from "react";
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
    bg: "#080810",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: (a: string) => `${a}20`,
    text: "#fff",
    textMuted: "rgba(255,255,255,0.55)",
    textDim: "rgba(255,255,255,0.45)",
    tagBg: (a: string) => `linear-gradient(135deg, ${a}15, ${a}05)`,
    tagColor: "#fff",
    navBg: "rgba(8,8,16,0.9)",
    dotColor: (_a: string) => "#4edea3",
    sectionBorder: (a: string) => `${a}15`,
    glowBg: (a: string) => `radial-gradient(circle, ${a}25, transparent)`,
  },
  light: {
    bg: "#f5f0ff",
    cardBg: "rgba(255,255,255,0.85)",
    cardBorder: (a: string) => `${a}30`,
    text: "#1a1a2e",
    textMuted: "rgba(0,0,0,0.55)",
    textDim: "rgba(0,0,0,0.4)",
    tagBg: (a: string) => `linear-gradient(135deg, ${a}12, ${a}04)`,
    tagColor: "#1a1a2e",
    navBg: "rgba(245,240,255,0.95)",
    dotColor: (a: string) => a,
    sectionBorder: (a: string) => `${a}20`,
    glowBg: (a: string) => `radial-gradient(circle, ${a}12, transparent)`,
  },
};

function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <>{displayed}<span style={{ animation: "blink 1s infinite", borderRight: "3px solid currentColor", marginLeft: "2px" }} /></>;
}

export default function Template3Bold({ data, projects, accent, themeMode: outerTheme = "dark" }: Props) {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(outerTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = THEMES[themeMode];
  useEffect(() => { setThemeMode(outerTheme); }, [outerTheme]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0) scale(1)";
          }
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const cardStyle: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(40px) scale(0.97)",
    transition: "opacity 0.6s ease, transform 0.6s ease",
  };

  const secondColor = accent + "99";

  return (
    <div ref={rootRef} style={{ position: "relative", background: t.bg, minHeight: "80vh", fontFamily: "'Inter', sans-serif", overflow: "hidden" }} className="t3-root">
      <style>{`
        .t3-root .t3-nav { padding: 20px 48px; }
        .t3-root .t3-nav-links { gap: 8px; }
        .t3-root .t3-hamburger { }
        .t3-root .t3-hero { padding: 80px 48px 70px; }
        .t3-root .t3-shape-lg { width: 300px; height: 300px; top: 10%; right: 5%; }
        .t3-root .t3-shape-md { width: 200px; height: 200px; bottom: 0%; left: 10%; }
        .t3-root .t3-shape-sm { width: 100px; height: 100px; top: 40%; right: 20%; }
        .t3-root .t3-section { padding: 60px 48px; }
        .t3-root .t3-contact { padding: 80px 48px; }
        .t3-root[data-view="tablet"] .t3-nav,
        .t3-root[data-view="mobile"] .t3-nav { padding: 12px 16px; }
        .t3-root[data-view="tablet"] .t3-hero,
        .t3-root[data-view="mobile"] .t3-hero { padding: 40px 16px 40px; }
        .t3-root[data-view="tablet"] .t3-shape-lg,
        .t3-root[data-view="mobile"] .t3-shape-lg { width: 120px; height: 120px; top: 5%; }
        .t3-root[data-view="tablet"] .t3-shape-md,
        .t3-root[data-view="mobile"] .t3-shape-md { width: 80px; height: 80px; }
        .t3-root[data-view="tablet"] .t3-shape-sm,
        .t3-root[data-view="mobile"] .t3-shape-sm { width: 50px; height: 50px; top: 30%; }
        .t3-root[data-view="tablet"] .t3-section,
        .t3-root[data-view="mobile"] .t3-section { padding: 36px 16px; }
        .t3-root[data-view="tablet"] .t3-contact,
        .t3-root[data-view="mobile"] .t3-contact { padding: 40px 16px; }
      `}</style>
      {/* Theme toggle inside template */}
      <button onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
        style={{ position: "fixed", top: 12, right: 12, zIndex: 999, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${t.cardBorder(accent)}`, background: t.navBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
        title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}>
        {themeMode === "dark" ? "☀️" : "🌙"}
      </button>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, background: t.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.cardBorder(accent)}` }} className="t3-nav">
        <div style={{ fontWeight: 900, fontSize: "1.3rem", color: t.text }}>
          {data.fullName?.split(" ")[0] || "Dev"}
        </div>
        <div style={{ display: isMobileView ? "none" : "flex", gap: "8px" }} className="t3-nav-links">
          {["About", "Skills", "Work", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={handleNavClick}
              style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.82rem", fontWeight: 600, padding: "6px 14px", borderRadius: "20px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${accent}20`; (e.currentTarget as HTMLElement).style.color = accent; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = t.textMuted; }}>
              {item}
            </a>
          ))}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="t3-hamburger"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: isMobileView ? "flex" : "none", flexDirection: "column", gap: "3px", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "20px", height: "2px", background: t.text, borderRadius: "2px" }} />
          <div style={{ width: "20px", height: "2px", background: t.text, borderRadius: "2px" }} />
          <div style={{ width: "20px", height: "2px", background: t.text, borderRadius: "2px" }} />
        </button>
      </nav>
      {menuOpen && (
        <div style={{ position: "sticky", top: 0, zIndex: 9, background: t.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.cardBorder(accent)}`, padding: "8px 16px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {["About", "Skills", "Work", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={handleNavClick}
              style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, padding: "8px 12px", borderRadius: "10px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${accent}20`; (e.currentTarget as HTMLElement).style.color = accent; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = t.textMuted; }}>
              {item}
            </a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="about" style={{ padding: "80px 48px 70px", position: "relative", overflow: "hidden" }} className="t3-hero">
        {/* Animated bg shapes */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "300px", height: "300px", borderRadius: "50%", background: t.glowBg(accent), animation: "float 6s ease-in-out infinite", pointerEvents: "none" }} className="t3-shape-lg" />
        <div style={{ position: "absolute", bottom: "0%", left: "10%", width: "200px", height: "200px", border: `2px solid ${t.cardBorder(accent)}`, borderRadius: "50%", animation: "spin-slow 20s linear infinite", pointerEvents: "none" }} className="t3-shape-md" />
        <div style={{ position: "absolute", top: "40%", right: "20%", width: "100px", height: "100px", border: `1px solid ${t.cardBorder(accent)}`, borderRadius: "12px", transform: "rotate(45deg)", animation: "spin-slow 15s linear infinite reverse", pointerEvents: "none" }} className="t3-shape-sm" />

        <div style={{ position: "relative", maxWidth: "800px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.dotColor(accent), boxShadow: `0 0 12px ${t.dotColor(accent)}`, animation: "blink 2s infinite" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: t.dotColor(accent), letterSpacing: "0.15em", textTransform: "uppercase" }}>Available now</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "20px", color: t.text, overflowWrap: "break-word", wordBreak: "break-word" }}>
            {data.fullName || "Your Name"}
          </h1>

          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: accent, marginBottom: "20px", minHeight: "2rem" }}>
            <TypewriterText text={data.title || "Your Title"} speed={60} />
          </div>

          <p style={{ fontSize: "1rem", color: t.textMuted, lineHeight: 1.9, maxWidth: "580px", marginBottom: "40px", overflowWrap: "break-word" }}>
            {data.bio || "Your bio will appear here."}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
            {data.email && (
              <a href={`mailto:${data.email}`}
                style={{ padding: "13px 32px", background: `linear-gradient(135deg, ${accent}, ${secondColor})`, color: "#fff", textDecoration: "none", borderRadius: "50px", fontWeight: 700, fontSize: "0.9rem", boxShadow: `0 0 30px ${accent}40`, transition: "all 0.3s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${accent}60`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${accent}40`; }}>
                Hire me ✦
              </a>
            )}
            {data.github && (
              <a href={data.github} target="_blank" rel="noreferrer"
                style={{ padding: "13px 32px", background: "transparent", color: t.text, textDecoration: "none", borderRadius: "50px", fontWeight: 700, fontSize: "0.9rem", border: `2px solid ${t.cardBorder(accent)}`, transition: "all 0.3s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder(accent); (e.currentTarget as HTMLElement).style.color = t.text; }}>
                GitHub ↗
              </a>
            )}
            {data.website && (
              <a href={data.website} target="_blank" rel="noreferrer"
                style={{ padding: "13px 32px", background: "transparent", color: t.text, textDecoration: "none", borderRadius: "50px", fontWeight: 700, fontSize: "0.9rem", border: `2px solid ${t.cardBorder(accent)}`, transition: "all 0.3s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder(accent); (e.currentTarget as HTMLElement).style.color = t.text; }}>
                Website ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      {data.skills.length > 0 && (
        <section id="skills" style={{ padding: "60px 48px", borderTop: `1px solid ${t.sectionBorder(accent)}` }} className="t3-section">
          <div ref={(el) => { cardsRef.current[0] = el; }} style={{ ...cardStyle }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "28px" }}>
              ✦ Skills & Stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {data.skills.map((skill, idx) => (
                <span key={skill}
                  style={{ padding: "8px 20px", background: t.tagBg(accent), color: t.tagColor, border: `1px solid ${accent}30`, borderRadius: "50px", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.3s", animationDelay: `${idx * 0.1}s` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${accent}30`; (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 15px ${accent}30`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = t.tagBg(accent); (e.currentTarget as HTMLElement).style.borderColor = `${accent}30`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experiences.length > 0 && (
        <section id="work" style={{ padding: "60px 48px", borderTop: `1px solid ${t.sectionBorder(accent)}` }} className="t3-section">
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "28px" }}>✦ Experience</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {data.experiences.map((exp, idx) => (
              <div key={idx} ref={(el) => { cardsRef.current[idx + 1] = el; }} style={{ ...cardStyle, padding: "28px", background: t.cardBg, border: `1px solid ${t.cardBorder(accent)}`, borderRadius: "20px", position: "relative", overflow: "hidden", transition: "all 0.3s ease, opacity 0.6s ease, transform 0.6s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${accent}08`; (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`; (e.currentTarget as HTMLElement).style.transform = "translateX(8px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = t.cardBg; (e.currentTarget as HTMLElement).style.borderColor = `${t.cardBorder(accent)}`; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: `linear-gradient(180deg, ${accent}, transparent)`, borderRadius: "20px 0 0 20px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: t.text, margin: 0 }}>{exp.title}</h3>
                  <span style={{ fontSize: "0.78rem", color: accent, fontWeight: 700, padding: "4px 14px", background: `${accent}15`, borderRadius: "20px", border: `1px solid ${accent}30` }}>{exp.company}</span>
                </div>
                <p style={{ fontSize: "0.88rem", color: t.textMuted, margin: 0, lineHeight: 1.8 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: "60px 48px", borderTop: `1px solid ${t.sectionBorder(accent)}` }} className="t3-section">
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "28px" }}>✦ Projects</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {projects.map((proj, idx) => (
              <div key={idx} ref={(el) => { cardsRef.current[data.experiences.length + idx + 1] = el; }}
                style={{ ...cardStyle, background: t.cardBg, border: `1px solid ${t.cardBorder(accent)}`, borderRadius: "20px", overflow: "hidden", transition: "all 0.3s ease, opacity 0.6s ease, transform 0.6s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${accent}25`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${t.cardBorder(accent)}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {proj.imageUrl ? (
                  <img src={proj.imageUrl} alt={proj.title} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div style={{ height: "150px", background: `linear-gradient(135deg, ${accent}20, ${themeMode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", border: `2px solid ${accent}30`, animation: "spin-slow 10s linear infinite" }} />
                    <span style={{ fontSize: "2.5rem", position: "relative" }}>✦</span>
                  </div>
                )}
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: t.text, marginBottom: "8px" }}>{proj.title}</h3>
                  <p style={{ fontSize: "0.83rem", color: t.textMuted, lineHeight: 1.7, marginBottom: "14px" }}>{proj.description}</p>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: "0.8rem", color: accent, textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      View project ✦
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" style={{ padding: "80px 48px", borderTop: `1px solid ${t.sectionBorder(accent)}`, textAlign: "center", position: "relative", overflow: "hidden" }} className="t3-contact">
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${accent}10, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>✦ Contact</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: t.text, marginBottom: "16px", letterSpacing: "-0.03em" }}>
            Let's build something
          </h2>
          <p style={{ fontSize: "1rem", color: t.textMuted, marginBottom: "36px", maxWidth: "400px", margin: "0 auto 36px" }}>
            Have a project in mind? Let's make it happen.
          </p>
          {data.email && (
            <a href={`mailto:${data.email}`}
              style={{ display: "inline-block", padding: "16px 48px", background: `linear-gradient(135deg, ${accent}, ${secondColor})`, color: "#fff", textDecoration: "none", borderRadius: "50px", fontWeight: 800, fontSize: "1rem", boxShadow: `0 0 40px ${accent}40`, transition: "all 0.3s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${accent}60`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${accent}40`; }}>
              Start a conversation ✦
            </a>
          )}
        </div>
      </section>
    </div>
  );
}