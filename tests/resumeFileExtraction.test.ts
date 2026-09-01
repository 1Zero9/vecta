import { beforeEach, describe, expect, it, vi } from "vitest";
import { extractResume } from "@/lib/resumeExtraction";

const parserMocks = vi.hoisted(() => ({
  extractRawText: vi.fn(),
  getDocument: vi.fn(),
}));

vi.mock("mammoth/mammoth.browser", () => ({
  extractRawText: parserMocks.extractRawText,
}));

vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: parserMocks.getDocument,
}));

function mockFile(name: string): File {
  return {
    name,
    size: 2048,
    arrayBuffer: async () => new ArrayBuffer(8),
  } as File;
}

describe("resume file extraction", () => {
  beforeEach(() => {
    parserMocks.extractRawText.mockReset();
    parserMocks.getDocument.mockReset();
  });

  it("normalizes a section-heavy DOCX and analyses its content", async () => {
    parserMocks.extractRawText.mockResolvedValue({
      value: [
        "MORGAN CASEY\tCLOUD SECURITY LEAD   ",
        "\n\nPROFILE\nOver 11 years of professional experience in cloud security.",
        "\n\nSKILLS\nAWS\tAzure\tKubernetes\tTerraform",
        "\n\nCERTIFICATIONS\nCISSP\tAWS Certified Solutions Architect",
      ].join(""),
    });

    const result = await extractResume(mockFile("morgan-casey.docx"));

    expect(result.text).not.toContain("\t\n");
    expect(result.suggestedYearsExperience).toBe(11);
    expect(result.suggestedSkills).toEqual(
      expect.arrayContaining(["AWS", "Azure", "Cloud Security", "Kubernetes", "Terraform"]),
    );
    expect(result.suggestedCertifications).toEqual(
      expect.arrayContaining(["CISSP", "AWS Certified Solutions Architect"]),
    );
  });

  it("reconstructs multi-page PDF text before analysis", async () => {
    const destroy = vi.fn().mockResolvedValue(undefined);
    const pages = [
      [
        { str: "PROFILE", hasEOL: true },
        { str: "Security specialist with 8 years of experience.", hasEOL: true },
        { str: "Python", hasEOL: false },
        { str: "and", hasEOL: false },
        { str: "Threat Modelling", hasEOL: true },
      ],
      [
        { str: "CERTIFICATIONS", hasEOL: true },
        { str: "ISO 27001 Lead Auditor", hasEOL: true },
      ],
    ];

    parserMocks.getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: pages.length,
        getPage: async (pageNumber: number) => ({
          getTextContent: async () => ({ items: pages[pageNumber - 1] }),
        }),
      }),
      destroy,
    });

    const result = await extractResume(mockFile("security-profile.pdf"));

    expect(result.pageCount).toBe(2);
    expect(result.text).toContain("Python and Threat Modelling");
    expect(result.suggestedSkills).toEqual(expect.arrayContaining(["Python", "Threat Modelling"]));
    expect(result.suggestedCertifications).toContain("ISO 27001 Lead Auditor");
    expect(destroy).toHaveBeenCalledOnce();
  });

  it("identifies an image-only PDF and still releases the parser", async () => {
    const destroy = vi.fn().mockResolvedValue(undefined);
    parserMocks.getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: async () => ({
          getTextContent: async () => ({ items: [] }),
        }),
      }),
      destroy,
    });

    await expect(extractResume(mockFile("scanned-resume.pdf"))).rejects.toThrow(
      "scanned or image-based",
    );
    expect(destroy).toHaveBeenCalledOnce();
  });
});
