import { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { FiCheckCircle, FiUpload } from "react-icons/fi";
import { BsStars, BsPerson, BsEnvelope, BsBriefcase, BsLink45Deg, BsBook, BsCheck2Circle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setRawText, setExtractedData, resetExtractedData, setPortfolioData } from "../../store/slices/portfolioSlice";
import type { RootState } from "../../store";
import { playPortfolioCreatedSound, playCheckSound } from "../../utils/sounds";
import { extractFromText, extractFromPDF } from "../../services/aiService";

const extractionChecks = [
  { id: "basicInfo",       label: "Basic Info",       icon: BsPerson    },
  { id: "contactInfo",     label: "Contact Info",     icon: BsEnvelope  },
  { id: "workExperiences", label: "Work Experiences", icon: BsBriefcase },
  { id: "socialLinks",     label: "Social Links",     icon: BsLink45Deg },
  { id: "education",       label: "Education",        icon: BsBook      },
];

const glassStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const CreatePortfolio = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const fileRef   = useRef<HTMLInputElement>(null);
  const { rawText, extractedData } = useSelector((s: RootState) => s.portfolio);

  const [promptText,   setPromptText]   = useState(rawText);
  const [generating,   setGenerating]   = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMsg,     setErrorMsg]     = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
    dispatch(setRawText(e.target.value));
    if (uploadedFile) setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      Swal.fire({ title: "Invalid file", text: "Please upload a PDF file only.", icon: "warning", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }
    setUploadedFile(file);
    setPromptText("");
    dispatch(setRawText(""));
  };

  const handleGenerate = async () => {
    if (!promptText.trim() && !uploadedFile) {
      Swal.fire({ title: "Input required", text: "Paste your CV text or upload a PDF file.", icon: "warning", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }

    setGenerating(true);
    setProcessingStep(0);
    setErrorMsg("");
    dispatch(resetExtractedData());

    try {
      const aiPromise = uploadedFile
        ? extractFromPDF(uploadedFile)
        : extractFromText(promptText);

      for (let i = 0; i < extractionChecks.length; i++) {
        await new Promise((r) => setTimeout(r, 700));
        setProcessingStep(i + 1);
        dispatch(setExtractedData({ [extractionChecks[i].id]: true }));
        playCheckSound();
      }

      const result = await aiPromise;

      dispatch(setPortfolioData(result));

      setGenerating(false);
      playPortfolioCreatedSound();

      Swal.fire({ title: "Portfolio created! 🎉", text: "AI extracted and built your professional data.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      setTimeout(() => navigate("/portfolio-editor"), 1500);

    } catch (err: unknown) {
      setGenerating(false);
      dispatch(resetExtractedData());
      setProcessingStep(0);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
      Swal.fire({ title: "AI Error", text: msg, icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
    }
  };

  useEffect(() => {
    dispatch(resetExtractedData());
    setProcessingStep(0);
  }, [dispatch]);

  const allExtracted = processingStep === extractionChecks.length;

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="mb-5">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="rounded-circle" style={{ width: 10, height: 10, background: "#4edea3", boxShadow: "0 0 12px rgba(78,222,163,0.6)", animation: "pulseGlow 2s ease-in-out infinite" }} />
          <span className="fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#4edea3", textTransform: "uppercase" }}>AI ENGINE STANDING BY</span>
        </div>
        <h1 className="fw-bold mb-2" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", lineHeight: 1.2 }}>
          Architect Your <span style={{ color: "var(--purple-main)" }}>Identity</span>
        </h1>
        <p className="mb-0" style={{ color: "var(--text-muted-custom)", fontSize: "0.95rem", maxWidth: 560, lineHeight: 1.7 }}>
          Transform your raw experience into a high-fidelity digital presence with our AI-powered extraction engine.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <div className="rounded-4 p-4 d-flex flex-column h-100" style={glassStyle}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <BsStars className="text-purple" size={18} />
              <h5 className="text-white fw-semibold mb-0">AI Smart Input</h5>
            </div>

            {/* PDF banner */}
            {uploadedFile ? (
              <div className="rounded-3 p-3 mb-3 d-flex align-items-center gap-3"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px dashed rgba(124,58,237,0.4)" }}>
                <FiUpload size={20} style={{ color: "#7C3AED" }} />
                <div className="flex-grow-1">
                  <div className="text-white fw-semibold" style={{ fontSize: "0.88rem" }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted-custom)" }}>{(uploadedFile.size / 1024).toFixed(1)} KB · PDF</div>
                </div>
                <button onClick={() => { setUploadedFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
              </div>
            ) : (
              <Form.Control as="textarea" rows={14}
                placeholder="Paste your entire CV or describe your professional journey here..."
                value={promptText} onChange={handleTextChange}
                className="text-white border-0 p-3 rounded-3 mb-3 flex-grow-1"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "inset 0 0 24px rgba(124,58,237,0.06)", outline: "none", fontSize: "0.92rem", lineHeight: "1.75", resize: "none" }}
              />
            )}

            {errorMsg && (
              <div className="rounded-3 p-2 mb-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "0.82rem", color: "#f87171" }}>
                ⚠ {errorMsg}
              </div>
            )}

            <div className="d-flex align-items-center gap-3 mb-3">
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={handleFileChange} />
              <button onClick={() => fileRef.current?.click()}
                style={{ fontSize: "0.8rem", color: "var(--text-muted-custom)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted-custom)")}>
                <FiUpload size={13} className="me-1" /> Upload PDF CV
              </button>
            </div>

            <Button className="w-100 py-3 rounded-pill fs-6 d-flex align-items-center justify-content-center gap-2"
              style={{ background: generating ? "var(--purple-dark)" : "var(--purple-main)", border: "none", fontWeight: "600", boxShadow: generating ? "0 0 20px rgba(124,58,237,0.25)" : "0 0 30px rgba(124,58,237,0.35)", transition: "all 0.3s ease" }}
              onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Analyzing & Extracting...</>
              ) : <>Generate & Preview Portfolio ✨</>}
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <div className="rounded-4 p-4 mb-4" style={glassStyle}>
            <h6 className="text-white fw-semibold mb-4">Data Extraction</h6>
            <div className="d-flex flex-column gap-3">
              {extractionChecks.map((item) => {
                const isExtracted = extractedData[item.id as keyof typeof extractedData] === true;
                const IconComp = item.icon;
                return (
                  <div key={item.id} className="d-flex align-items-center gap-3" style={{ transition: "all 0.4s ease" }}>
                    <div className="d-flex align-items-center justify-content-center rounded-3"
                      style={{ width: 36, height: 36, flexShrink: 0, background: isExtracted ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)", border: isExtracted ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.06)", transition: "all 0.4s ease" }}>
                      {isExtracted ? <BsCheck2Circle size={18} className="text-purple" /> : <IconComp size={16} style={{ color: "rgba(255,255,255,0.25)" }} />}
                    </div>
                    <span style={{ color: isExtracted ? "#ffffff" : "var(--text-muted-custom)", fontWeight: isExtracted ? "500" : "400", fontSize: "0.88rem", transition: "all 0.4s ease" }}>
                      {item.label}
                    </span>
                    {isExtracted && <FiCheckCircle size={16} className="ms-auto" style={{ color: "var(--green)", filter: "drop-shadow(0 0 4px rgba(78,222,163,0.5))" }} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-4 p-4 position-relative overflow-hidden"
            style={{ background: allExtracted ? "rgba(78,222,163,0.06)" : "rgba(124,58,237,0.06)", border: allExtracted ? "1px solid rgba(78,222,163,0.2)" : "1px solid rgba(124,58,237,0.2)", transition: "all 0.5s ease" }}>
            <div className="fw-semibold mb-3 d-flex align-items-center gap-2" style={{ color: allExtracted ? "var(--green)" : "var(--purple)", transition: "all 0.5s ease" }}>
              <BsStars /> Neural Sync Active
            </div>
            <div className="position-relative rounded-3" style={{ height: 80, background: "rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <svg width="100%" height="100%" viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: 0, left: 0 }}>
                <path d="M0 40 Q37.5 10 75 40 T150 40 T225 40 T300 40" stroke={allExtracted ? "rgba(78,222,163,0.4)" : "rgba(124,58,237,0.4)"} strokeWidth="2" style={{ animation: generating ? "pulseGlow 1.5s ease-in-out infinite" : "none" }} />
                <path d="M0 40 Q37.5 25 75 40 T150 40 T225 40 T300 40" stroke={allExtracted ? "rgba(78,222,163,0.15)" : "rgba(124,58,237,0.15)"} strokeWidth="1" />
                {generating && (<>
                  <circle cx="60" cy="25" r="3" fill="var(--purple)"><animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" /></circle>
                  <circle cx="120" cy="55" r="3" fill="var(--purple)"><animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite" /></circle>
                  <circle cx="180" cy="30" r="3" fill="var(--purple)"><animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" begin="0.3s" /></circle>
                  <circle cx="240" cy="50" r="3" fill="var(--purple)"><animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite" begin="0.5s" /></circle>
                </>)}
                {!generating && allExtracted && (<circle cx="150" cy="40" r="4" fill="var(--green)"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" /></circle>)}
              </svg>
              <div className="position-absolute bottom-0 start-0 p-2" style={{ fontSize: "0.7rem", color: "var(--text-muted-custom)" }}>
                {generating ? "Processing nodes..." : allExtracted ? "Sync complete" : "Awaiting input..."}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CreatePortfolio;
