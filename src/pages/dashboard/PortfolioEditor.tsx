import { useState, useEffect, useCallback, useRef } from "react";
import { Accordion, Form } from "react-bootstrap";
import {
  FiArrowLeft, FiShare2, FiRotateCcw, FiCheckCircle,
  FiMonitor, FiTablet, FiSmartphone, FiEye, FiEyeOff,
  FiPlus, FiTrash2, FiUpload, FiLink
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setExtractedData, setPortfolioData } from "../../store/slices/portfolioSlice";
import type { RootState } from "../../store";
import { refinePortfolio } from "../../services/aiService";
import type { PortfolioData } from "../../services/aiService";
import Template1Neon from "../../components/portfolio-templates/Template1Neon";
// import Template2Minimal from "../../components/portfolio-templates/Template2Minimal";
import Template2Minimal from "../../components/portfolio-templates/Template2Minimal";
import Template3Bold from "../../components/portfolio-templates/Template3Bold";
import { supabase } from "../../services/supabaseClient";

const themes = [
  { id: "purple", name: "Neon Purple", value: "#7C3AED" },
  { id: "green",  name: "Matrix Green", value: "#10B981" },
  { id: "blue",   name: "Cyber Blue",   value: "#3B82F6" },
  { id: "pink",   name: "Synth Pink",   value: "#EC4899" },
];

interface ProjectWithImage {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  imageMode: "url" | "upload";
}

const EMPTY_DATA: PortfolioData = {
  fullName: "", title: "", bio: "", email: "", phone: "",
  linkedin: "", github: "", website: "",
  skills: [], experiences: [], education: [], projects: [],
};

const PortfolioEditor = () => {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const { rawText, portfolioData } = useSelector((s: RootState) => s.portfolio);

  const [data,             setData]             = useState<PortfolioData>(EMPTY_DATA);
  const [projects,         setProjects]         = useState<ProjectWithImage[]>([]);
  const [selectedTheme,    setSelectedTheme]    = useState(themes[0]);
  const [glassmorphism,    setGlassmorphism]    = useState(false);
  const [themeMode,        setThemeMode]        = useState<"dark" | "light">("dark");
  const [selectedTemplate, setSelectedTemplate] = useState<1|2|3>(1);
  const [device,           setDevice]           = useState<"desktop"|"tablet"|"mobile">("desktop");
  const [aiRefinement,     setAiRefinement]     = useState("");
  const [aiRefining,       setAiRefining]       = useState(false);
  const [lastSaved,        setLastSaved]        = useState("Just now");
  const [activeAccordion,  setActiveAccordion]  = useState<string|null>("0");
  const [sidebarHidden,    setSidebarHidden]    = useState(false);
  const [newSkill,         setNewSkill]         = useState("");
  const snapshotRef = useRef<PortfolioData | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const portfolioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (portfolioData) {
      setData(portfolioData);
      snapshotRef.current = JSON.parse(JSON.stringify(portfolioData));
      setProjects((portfolioData.projects ?? []).map((p) => ({ ...p, imageUrl: "", imageMode: "url" as const })));
      dispatch(setExtractedData({ basicInfo: true, contactInfo: true, workExperiences: true, socialLinks: true, education: true }));
    } else if (rawText.trim()) {
      dispatch(setExtractedData({ basicInfo: true, contactInfo: true, workExperiences: true, socialLinks: true, education: true }));
    }
  }, [portfolioData, rawText, dispatch]);

  const handleChange = useCallback((field: keyof PortfolioData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setLastSaved("Just now");
  }, []);

  const handleExpChange = useCallback((idx: number, field: string, value: string) => {
    setData((prev) => {
      const exps = [...prev.experiences];
      exps[idx] = { ...exps[idx], [field]: value };
      return { ...prev, experiences: exps };
    });
    setLastSaved("Just now");
  }, []);

  const handleProjectChange = (idx: number, field: keyof ProjectWithImage, value: string) => {
    setProjects((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
    setLastSaved("Just now");
  };

  const handleProjectImageUpload = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProjects((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], imageUrl: reader.result as string, imageMode: "upload" };
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const addProject = () => setProjects((prev) => [...prev, { title: "", description: "", link: "", imageUrl: "", imageMode: "url" }]);
  const removeProject = (idx: number) => setProjects((prev) => prev.filter((_, i) => i !== idx));
  const addExperience = () => setData((prev) => ({ ...prev, experiences: [...prev.experiences, { title: "", company: "", description: "" }] }));
  const removeExperience = (idx: number) => setData((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== idx) }));
  const addSkill = (skill: string) => setData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
  const removeSkill = (idx: number) => setData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));

  const handleAiApply = async () => {
    if (!aiRefinement.trim()) {
      Swal.fire({ title: "Empty Prompt", text: "Please enter a refinement instruction.", icon: "warning", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }
    setAiRefining(true);
    try {
      const refined = await refinePortfolio(data, aiRefinement);
      setData(refined);
      dispatch(setPortfolioData(refined));
      setAiRefinement("");
      setLastSaved("Just now");
      Swal.fire({ title: "Refined! ✨", text: "AI has updated your portfolio.", icon: "success", timer: 1500, showConfirmButton: false, background: "#1a1040", color: "#fff" });
    } catch (err: unknown) {
      Swal.fire({ title: "AI Error", text: err instanceof Error ? err.message : "Something went wrong.", icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
    } finally {
      setAiRefining(false);
    }
  };

const handlePublish = async () => {
  const result = await Swal.fire({
    title: "Publish Portfolio?",
    text: "Your portfolio will be saved and live.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Publish!",
    confirmButtonColor: "#7C3AED",
    background: "#1a1040",
    color: "#fff",
  });

  if (result.isConfirmed) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("portfolios").insert({
        user_id: user.id,
        title: data.fullName || "My Portfolio",
        template: selectedTemplate,
        accent: accent,
        portfolio_data: { ...data, projects },
      });

      if (error) throw error;

      Swal.fire({ title: "Published! 🎉", text: "Your portfolio has been saved.", icon: "success", timer: 2000, showConfirmButton: false, background: "#1a1040", color: "#fff" });
      setTimeout(() => navigate("/portfolios"), 2100);
    } catch (err: unknown) {
      Swal.fire({ title: "Error!", text: err instanceof Error ? err.message : "Something went wrong.", icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
    }
  }
};
const handleDownloadPDF = async () => {
  const element = document.getElementById("portfolio-preview-container");

  if (!element || !element.innerHTML) {
    alert("Portfolio is empty!");
    return;
  }

  Swal.fire({
    title: "Generating PDF...",
    text: "Please wait a moment.",
    allowOutsideClick: false,
    showConfirmButton: false,
    background: "#1a1040",
    color: "#fff",
    didOpen: () => Swal.showLoading(),
  });

  try {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: selectedTemplate === 2 ? "#fafafa" : "#0d0d1a",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`${data.fullName || "portfolio"}.pdf`);

    Swal.close();
    Swal.fire({
      title: "Downloaded! 🎉",
      text: "Your portfolio PDF is ready.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#1a1040",
      color: "#fff",
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error",
      text: "Failed to generate PDF.",
      icon: "error",
      background: "#1a1040",
      color: "#fff",
    });
  }
};
  const deviceMaxWidth = device === "mobile" ? "390px" : device === "tablet" ? "768px" : "100%";
  const accent = selectedTheme.value;

  const templateOptions = [
    { id: 1 as const, name: "Neon Dark",      desc: "Dark & glowing" },
    { id: 2 as const, name: "Minimal Light", desc: "Clean & elegant" },
    { id: 3 as const, name: "Creative Bold",  desc: "Bold & animated" },
  ];

  return (
    <div style={{ background: "#0a0a14", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => navigate("/portfolios/create")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")}>
            <FiArrowLeft size={16} /> Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>Portfolio Editor</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "20px", background: "rgba(78,222,163,0.1)", border: "1px solid rgba(78,222,163,0.25)", fontSize: "0.62rem", fontWeight: 700, color: "#4edea3" }}>
            <FiCheckCircle size={10} /> AI SYNCED
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "3px" }}>
            {(["desktop","tablet","mobile"] as const).map((d) => {
              const Icon = d === "desktop" ? FiMonitor : d === "tablet" ? FiTablet : FiSmartphone;
              return (
                <button key={d} onClick={() => setDevice(d)}
                  style={{ background: device === d ? accent : "none", border: "none", color: device === d ? "#fff" : "rgba(255,255,255,0.4)", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", transition: "all 0.2s" }}>
                  <Icon size={15} />
                </button>
              );
            })}
          </div>

          <button onClick={() => setSidebarHidden(!sidebarHidden)}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: "10px", padding: "7px 14px", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = accent)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}>
            {sidebarHidden ? <FiEye size={14} /> : <FiEyeOff size={14} />}
            {sidebarHidden ? "Show Editor" : "Focus Mode"}
          </button>

          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}><FiCheckCircle size={11} style={{ marginRight: 4 }} />Saved {lastSaved}</span>
<button
  onClick={handleDownloadPDF}
  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}>
  ⬇ Download PDF
</button>

          <button onClick={handlePublish}
            style={{ background: accent, border: "none", color: "#fff", borderRadius: "10px", padding: "8px 20px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", boxShadow: `0 0 20px ${accent}55`, transition: "all 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}>
            Publish →
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width: sidebarHidden ? "0" : "320px", minWidth: sidebarHidden ? "0" : "320px", overflow: sidebarHidden ? "hidden" : "auto", transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)", borderRight: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: sidebarHidden ? "0" : "20px 16px 80px" }}>
          {!sidebarHidden && (
            <>
              {/* Template Switcher */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Template</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {templateOptions.map((t) => (
                    <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: `1px solid ${selectedTemplate === t.id ? accent : "rgba(255,255,255,0.08)"}`, background: selectedTemplate === t.id ? `${accent}15` : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s", textAlign: "left", width: "100%" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: selectedTemplate === t.id ? accent : "#fff" }}>{t.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{t.desc}</div>
                      </div>
                      {selectedTemplate === t.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Picker */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Theme</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {themes.map((t) => (
                    <button key={t.id} onClick={() => setSelectedTheme(t)} title={t.name}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: t.value, border: selectedTheme.id === t.id ? "3px solid #fff" : "3px solid transparent", cursor: "pointer", transition: "all 0.2s", boxShadow: selectedTheme.id === t.id ? `0 0 10px ${t.value}` : "none" }} />
                  ))}
                </div>
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>Glassmorphism</span>
                  <div onClick={() => setGlassmorphism(!glassmorphism)}
                    style={{ width: 36, height: 20, borderRadius: "10px", background: glassmorphism ? accent : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: glassmorphism ? 19 : 3, transition: "all 0.2s" }} />
                  </div>
                </div>
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>Theme Mode</span>
                  <div onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
                    style={{ width: 44, height: 22, borderRadius: "11px", background: themeMode === "dark" ? accent : "rgba(255,255,255,0.15)", cursor: "pointer", position: "relative", transition: "all 0.2s", display: "flex", alignItems: "center", padding: "0 4px" }}>
                    <span style={{ fontSize: "0.5rem", position: "absolute", left: 5, opacity: themeMode === "dark" ? 1 : 0.4, transition: "opacity 0.2s" }}>🌙</span>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: themeMode === "dark" ? 3 : 25, transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    <span style={{ fontSize: "0.5rem", position: "absolute", right: 5, opacity: themeMode === "light" ? 1 : 0.4, transition: "opacity 0.2s" }}>☀️</span>
                  </div>
                </div>
              </div>

              {/* Accordion */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden", marginBottom: "12px" }}>
                <Accordion activeKey={activeAccordion} onSelect={(k) => setActiveAccordion(Array.isArray(k) ? k[0] : k ?? null)} flush className="editorAccordion">

                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Basic Info</Accordion.Header>
                    <Accordion.Body style={{ padding: "0 16px 16px" }}>
                      {[
                        { label: "Full Name", field: "fullName" },
                        { label: "Job Title", field: "title" },
                        { label: "Email",     field: "email" },
                        { label: "Phone",     field: "phone" },
                      ].map(({ label, field }) => (
                        <Form.Group className="mb-2" key={field}>
                          <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{label}</Form.Label>
                          <Form.Control
value={(data as unknown as Record<string, string>)[field] ?? ""}                            onChange={(e) => handleChange(field as keyof PortfolioData, e.target.value)}
                            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px" }} />
                        </Form.Group>
                      ))}
                      <Form.Group>
                        <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} value={data.bio}
                          onChange={(e) => handleChange("bio", e.target.value)}
                          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px", resize: "none" }} />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Social Links</Accordion.Header>
                    <Accordion.Body style={{ padding: "0 16px 16px" }}>
                      {[
                        { label: "LinkedIn", field: "linkedin" },
                        { label: "GitHub",   field: "github" },
                        { label: "Website",  field: "website" },
                      ].map(({ label, field }) => (
                        <Form.Group className="mb-2" key={field}>
                          <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{label}</Form.Label>
                          <Form.Control
value={(data as unknown as Record<string, string>)[field] ?? ""}                            onChange={(e) => handleChange(field as keyof PortfolioData, e.target.value)}
                            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px" }} />
                        </Form.Group>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Experience</Accordion.Header>
                    <Accordion.Body style={{ padding: "0 16px 16px" }}>
                      {data.experiences.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "0.72rem", color: accent, fontWeight: 600 }}>#{idx + 1}</span>
                            <button onClick={() => removeExperience(idx)}
                              style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#f87171", borderRadius: "6px", padding: "3px 8px", cursor: "pointer", fontSize: "0.75rem" }}>
                              <FiTrash2 size={11} /> Remove
                            </button>
                          </div>
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Role</Form.Label>
                            <Form.Control value={exp.title} onChange={(e) => handleExpChange(idx, "title", e.target.value)}
                              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px" }} />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Company</Form.Label>
                            <Form.Control value={exp.company} onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px" }} />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} value={exp.description} onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px", resize: "none" }} />
                          </Form.Group>
                        </div>
                      ))}
                      <button onClick={addExperience}
                        style={{ width: "100%", marginTop: "8px", background: "rgba(124,58,237,0.1)", border: `1px dashed ${accent}50`, color: accent, borderRadius: "8px", padding: "8px", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <FiPlus size={13} /> Add Experience
                      </button>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Skills</Accordion.Header>
                    <Accordion.Body style={{ padding: "0 16px 16px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                        {data.skills.map((skill, idx) => (
                          <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: `${accent}20`, color: "#fff", borderRadius: "20px", padding: "4px 10px", fontSize: "0.78rem" }}>
                            {skill}
                            <button onClick={() => removeSkill(idx)}
                              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "0", fontSize: "0.85rem", lineHeight: 1 }}>×</button>
                          </span>
                        ))}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <input
                          value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && newSkill.trim()) { addSkill(newSkill.trim()); setNewSkill(""); setLastSaved("Just now"); } }}
                          placeholder="Type a skill and press Enter"
                          style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px", outline: "none" }} />
                        <button onClick={() => { if (newSkill.trim()) { addSkill(newSkill.trim()); setNewSkill(""); setLastSaved("Just now"); } }}
                          style={{ width: "100%", background: accent, border: "none", color: "#fff", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                          Add
                        </button>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4">
                    <Accordion.Header>Projects</Accordion.Header>
                    <Accordion.Body style={{ padding: "0 16px 16px" }}>
                      {projects.map((proj, idx) => (
                        <div key={idx} style={{ marginBottom: "20px", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: accent }}>Project #{idx + 1}</span>
                            <button onClick={() => removeProject(idx)}
                              style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#f87171", borderRadius: "6px", padding: "3px 8px", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <FiTrash2 size={11} /> Remove
                            </button>
                          </div>
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Title</Form.Label>
                            <Form.Control value={proj.title} onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px" }} />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} value={proj.description} onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px", resize: "none" }} />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Project Link</Form.Label>
                            <Form.Control value={proj.link} onChange={(e) => handleProjectChange(idx, "link", e.target.value)} placeholder="https://..."
                              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px" }} />
                          </Form.Group>
                          <Form.Label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "6px", display: "block" }}>Project Image</Form.Label>
                          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                            <button onClick={() => handleProjectChange(idx, "imageMode", "url")}
                              style={{ flex: 1, background: proj.imageMode === "url" ? `${accent}20` : "rgba(255,255,255,0.04)", border: `1px solid ${proj.imageMode === "url" ? accent : "rgba(255,255,255,0.08)"}`, color: proj.imageMode === "url" ? accent : "rgba(255,255,255,0.5)", borderRadius: "7px", padding: "5px", cursor: "pointer", fontSize: "0.72rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                              <FiLink size={11} /> URL
                            </button>
                            <button onClick={() => handleProjectChange(idx, "imageMode", "upload")}
                              style={{ flex: 1, background: proj.imageMode === "upload" ? `${accent}20` : "rgba(255,255,255,0.04)", border: `1px solid ${proj.imageMode === "upload" ? accent : "rgba(255,255,255,0.08)"}`, color: proj.imageMode === "upload" ? accent : "rgba(255,255,255,0.5)", borderRadius: "7px", padding: "5px", cursor: "pointer", fontSize: "0.72rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                              <FiUpload size={11} /> Upload
                            </button>
                          </div>
                          {proj.imageMode === "url" ? (
                            <Form.Control value={proj.imageUrl} onChange={(e) => handleProjectChange(idx, "imageUrl", e.target.value)} placeholder="https://example.com/image.png"
                              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "7px 10px" }} />
                          ) : (
                            <>
                              <input type="file" accept="image/*" style={{ display: "none" }} ref={(el) => { fileRefs.current[idx] = el; }}
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProjectImageUpload(idx, f); }} />
                              <button onClick={() => fileRefs.current[idx]?.click()}
                                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "10px", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                <FiUpload size={13} />
                                {proj.imageUrl ? "Change Image" : "Choose Image"}
                              </button>
                            </>
                          )}
                          {proj.imageUrl && (
                            <img src={proj.imageUrl} alt="preview" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", marginTop: "8px", border: "1px solid rgba(255,255,255,0.08)" }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          )}
                        </div>
                      ))}
                      <button onClick={addProject}
                        style={{ width: "100%", background: `${accent}15`, border: `1px dashed ${accent}50`, color: accent, borderRadius: "10px", padding: "10px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${accent}25`)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = `${accent}15`)}>
                        <FiPlus size={14} /> Add Project
                      </button>
                    </Accordion.Body>
                  </Accordion.Item>

                </Accordion>
              </div>

              {/* AI Refinement */}
              <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "14px", padding: "16px" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: accent, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <BsStars size={14} /> AI Refinement
                </div>
                <Form.Control as="textarea" rows={3}
                  placeholder='e.g., "Make my bio more senior"'
                  value={aiRefinement} onChange={(e) => setAiRefinement(e.target.value)}
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "8px", fontSize: "0.82rem", padding: "8px 10px", resize: "none" }} />
                <button onClick={handleAiApply} disabled={aiRefining}
                  style={{ width: "100%", marginTop: "8px", background: aiRefining ? "rgba(124,58,237,0.3)" : accent, border: "none", color: "#fff", borderRadius: "8px", padding: "9px", cursor: aiRefining ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  {aiRefining ? <><span className="spinner-border spinner-border-sm me-1" role="status" />Refining...</> : <><BsStars size={13} /> Apply Refinement</>}
                </button>
              </div>

              {/* Reset */}
              <button onClick={() => {
                if (!snapshotRef.current) return;
                setData(JSON.parse(JSON.stringify(snapshotRef.current)));
                setProjects((snapshotRef.current.projects ?? []).map((p: any) => ({ ...p, imageUrl: "", imageMode: "url" as const })));
                Swal.fire({ title: "Reset!", text: "Changes reverted to original data.", icon: "success", timer: 1500, showConfirmButton: false, background: "#1a1040", color: "#fff" });
              }}
  style={{ width: "100%", marginTop: "10px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "10px", padding: "9px", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#7C3AED"; (e.currentTarget as HTMLElement).style.color = "#a78bfa"; }}
  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
  <FiRotateCcw size={13} /> Reset Changes
</button>
            </>
          )}
        </div>

        {/* RIGHT: PREVIEW */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px", background: "#0a0a14" }}>
          {/* Browser chrome */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px 16px 0 0", padding: "10px 16px", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["#ff5f57","#ffbd2e","#28ca42"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: "6px", padding: "4px 12px", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
              🔒 {data.fullName ? data.fullName.toLowerCase().replace(/\s+/g, "-") + ".portfolio.com" : "your-portfolio.com"}
            </div>
            <FiShare2 size={13} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer" }} />
          </div>

          {/* Portfolio Preview */}
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", borderRadius: "0 0 16px 16px", overflow: "hidden", maxWidth: deviceMaxWidth, margin: "0 auto", transition: "max-width 0.3s ease" }}>
  <div id="portfolio-preview-container" ref={portfolioRef}>
    {selectedTemplate === 1 && <Template1Neon data={data} projects={projects} accent={accent} glassmorphism={glassmorphism} themeMode={themeMode} />}
    {selectedTemplate === 2 && <Template2Minimal data={data} projects={projects} accent={accent} themeMode={themeMode} />}
    {selectedTemplate === 3 && <Template3Bold data={data} projects={projects} accent={accent} themeMode={themeMode} />}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;



