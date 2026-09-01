export interface ResumeExtraction {
  fileName: string;
  text: string;
  wordCount: number;
  pageCount?: number;
  suggestedSkills: string[];
  suggestedCertifications: string[];
  suggestedYearsExperience?: number;
}

export interface ResumeTextAnalysis {
  wordCount: number;
  suggestedSkills: string[];
  suggestedCertifications: string[];
  suggestedYearsExperience?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const skillTerms = [
  "AI Governance", "AI Risk Management", "AWS", "Azure", "Cloud Security",
  "Cybersecurity", "Data Governance", "DevOps", "Docker", "GCP", "Generative AI",
  "Incident Response", "Information Security", "ISO 27001", "ISO 42001", "Kubernetes",
  "Machine Learning", "MLOps", "NIS2", "NIST", "Python", "Risk Management", "SOC 2",
  "Stakeholder Management", "Terraform", "Threat Modelling", "TypeScript", "Vendor Risk",
] as const;

const certificationTerms = [
  "AWS Certified Cloud Practitioner", "AWS Certified Solutions Architect", "AZ-104", "AZ-500",
  "CCSP", "CEH", "CIPP/E", "CISM", "CISSP", "CKA", "CKAD", "CRISC", "IAPP AIGP",
  "ISO 27001 Lead Auditor", "ISO 27001 Lead Implementer", "PMP",
] as const;

function findTerms(text: string, terms: readonly string[]): string[] {
  const normalizedText = text.toLocaleLowerCase();
  return terms.filter((term) => {
    const escapedTerm = term.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escapedTerm}([^a-z0-9]|$)`, "i").test(normalizedText);
  });
}

function findYearsExperience(text: string): number | undefined {
  const matches = Array.from(
    text.matchAll(/(?:over\s+|more than\s+)?(\d{1,2})\+?\s+years?(?:\s+of)?\s+(?:professional\s+)?experience/gi),
  )
    .map((match) => Number(match[1]))
    .filter((years) => years > 0 && years <= 50);
  return matches.length > 0 ? Math.max(...matches) : undefined;
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function analyzeResumeText(text: string): ResumeTextAnalysis {
  const cleanedText = cleanExtractedText(text);
  return {
    wordCount: cleanedText.split(/\s+/).filter(Boolean).length,
    suggestedSkills: findTerms(cleanedText, skillTerms),
    suggestedCertifications: findTerms(cleanedText, certificationTerms),
    suggestedYearsExperience: findYearsExperience(cleanedText),
  };
}

async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<{ text: string; pageCount: number }> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const document = await loadingTask.promise;
  const pageCount = document.numPages;
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const lines: string[] = [];
      let currentLine = "";

      for (const item of content.items) {
        if (!("str" in item)) continue;
        currentLine += `${item.str}${item.hasEOL ? "\n" : " "}`;
        if (item.hasEOL) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
      }

      if (currentLine.trim()) lines.push(currentLine.trim());
      pages.push(lines.filter(Boolean).join("\n"));
    }
  } finally {
    await loadingTask.destroy();
  }

  return { text: pages.join("\n\n"), pageCount };
}

async function extractDocxText(arrayBuffer: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth/mammoth.browser");
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function extractResume(file: File): Promise<ResumeExtraction> {
  if (file.size > MAX_FILE_SIZE) throw new Error("Choose a résumé smaller than 10 MB.");

  const extension = file.name.split(".").pop()?.toLocaleLowerCase();
  if (extension !== "pdf" && extension !== "docx") {
    throw new Error("Vecta currently supports PDF and DOCX résumés.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const extracted = extension === "pdf"
    ? await extractPdfText(arrayBuffer)
    : { text: await extractDocxText(arrayBuffer), pageCount: undefined };
  const text = cleanExtractedText(extracted.text);

  if (text.length < 40) {
    throw new Error(
      extension === "pdf"
        ? "We could not find readable text in this PDF. It may be scanned or image-based."
        : "We could not find enough readable text in this DOCX.",
    );
  }

  return {
    fileName: file.name,
    text,
    pageCount: extracted.pageCount,
    ...analyzeResumeText(text),
  };
}
