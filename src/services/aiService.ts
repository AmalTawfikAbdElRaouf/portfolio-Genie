export interface PortfolioData {
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  skills: string[];
  experiences: { title: string; company: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  projects: { title: string; description: string; link: string }[];
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-001",
];

const SCHEMA_PROMPT = `Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "fullName": "full name",
  "title": "job title",
  "bio": "professional summary in 2 sentences",
  "email": "email",
  "phone": "phone number",
  "linkedin": "linkedin url or username",
  "github": "github url or username",
  "website": "personal website",
  "skills": ["skill1", "skill2", "skill3"],
  "experiences": [
    { "title": "job title", "company": "company", "description": "what you did" }
  ],
  "education": [
    { "degree": "degree name", "school": "university", "year": "year" }
  ],
  "projects": [
    { "title": "project name", "description": "what it does", "link": "#" }
  ]
}
For contact fields (email, phone, linkedin, github, website): if the text doesn't include a value, generate a reasonable placeholder based on the person's name (e.g. "name@email.com" for email, "linkedin.com/in/name" for linkedin). NEVER leave email, phone, linkedin, or github empty.
Use empty array [] for missing arrays like skills, experiences, education, projects.`;

async function callGemini(parts: object[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not set. Add it to your .env file");
  }

  let lastError = "";

  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2000 },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err as { error?: { message?: string } }).error?.message ?? res.statusText;
        if (res.status === 429) { lastError = msg; continue; }
        throw new Error(`Gemini error (${res.status}): ${msg}`);
      }

      const data = await res.json() as {
        candidates: { content: { parts: { text: string }[] } }[];
      };

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return raw.replace(/```json|```/g, "").trim();

    } catch (e) {
      if ((e as Error).message?.includes("429")) {
        lastError = (e as Error).message;
        continue;    
      }
      throw e;
    }
  }

  throw new Error(`All available models have reached rate limit. Wait a moment and try again.\n${lastError}`);
}

export async function extractFromText(rawText: string): Promise<PortfolioData> {
  const prompt = `Extract portfolio data from this CV/profile text.\n${SCHEMA_PROMPT}\n\nText:\n${rawText}`;
  const text = await callGemini([{ text: prompt }]);
  return parseJSON(text);
}

export async function extractFromPDF(file: File): Promise<PortfolioData> {
  // حول الـ PDF لنص الأول
  const pdfText = await extractTextFromPDF(file);
  
  // بعدين ابعت النص للـ AI زي الـ text عادي
  const prompt = `Extract portfolio data from this CV text extracted from PDF.\n${SCHEMA_PROMPT}\n\nText:\n${pdfText}`;
  const text = await callGemini([{ text: prompt }]);
  return parseJSON(text);
}

async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs`;  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }
  
  return fullText.trim();
}

export async function refinePortfolio(
  current: PortfolioData,
  instruction: string
): Promise<PortfolioData> {
  const prompt = `You are refining a portfolio. Current data:\n${JSON.stringify(current, null, 2)}\n\nInstruction: "${instruction}"\n\n${SCHEMA_PROMPT}\nOnly change what the instruction asks. Keep everything else the same.`;
  const text = await callGemini([{ text: prompt }]);
  return { ...current, ...parseJSON(text) };
}

function parseJSON(raw: string): PortfolioData {
  try {
    return JSON.parse(raw) as PortfolioData;
  } catch {
    throw new Error("AI returned invalid data. Please try again.");
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
