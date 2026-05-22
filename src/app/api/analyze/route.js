import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import os from "node:os";
import path from "node:path";

export const runtime = "nodejs";
export const maxDuration = 60;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function extractTextWithPdfParse(buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const pdfData = await parser.getText();
    return pdfData.text.replace(/\s+/g, " ").trim();
  } finally {
    await parser.destroy();
  }
}

async function extractTextWithOcr(buffer) {
  if (process.env.ENABLE_LOCAL_OCR !== "true") {
    return "";
  }

  const { createWorker } = await import("tesseract.js");
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const worker = await createWorker("eng", 1, {
    workerPath: require.resolve("tesseract.js/src/worker-script/node/index.js"),
    corePath: require.resolve("tesseract.js-core/tesseract-core-simd.wasm.js"),
    cachePath: path.join(os.tmpdir(), "resumeai-tesseract"),
  });

  try {
    const screenshots = await parser.getScreenshot({
      first: 3,
      imageDataUrl: false,
      imageBuffer: true,
      scale: 2,
    });

    const pageTexts = [];

    for (const page of screenshots.pages) {
      const result = await worker.recognize(Buffer.from(page.data));
      pageTexts.push(result.data.text);
    }

    return pageTexts.join("\n").replace(/\s+/g, " ").trim();
  } finally {
    await worker.terminate();
    await parser.destroy();
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to Buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length === 0) {
      return NextResponse.json(
        { error: "The uploaded PDF is empty. Please choose a valid resume PDF." },
        { status: 400 }
      );
    }

    let text = "";

    try {
      text = await extractTextWithPdfParse(buffer);
    } catch (error) {
      console.error("Error extracting resume text from PDF:", error);
      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "production"
              ? "Could not read this PDF on the server. Please try a text-based PDF or check the deployment logs for the PDF extraction error."
              : `Could not read this PDF: ${error.message}`,
        },
        { status: 400 }
      );
    }

    if (text.length < 100) {
      try {
        text = await extractTextWithOcr(buffer);
      } catch (error) {
        console.error("Error extracting resume text with OCR:", error);
        return NextResponse.json(
          {
            error:
              "Could not OCR this PDF on the server. Please upload a text-based PDF or try again with a clearer file.",
          },
          { status: 400 }
        );
      }

      if (text.length < 100) {
        return NextResponse.json(
          {
            error:
              process.env.ENABLE_LOCAL_OCR === "true"
                ? "Could not extract enough resume text. Please upload a clearer PDF or a text-based resume PDF."
                : "This PDF appears to be scanned or image-only. Please upload a text-based PDF, or enable OCR on the server.",
          },
          { status: 400 }
        );
      }
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Groq API key is not configured on the server. Add GROQ_API_KEY in your deployment environment variables.",
        },
        { status: 500 }
      );
    }

    // Prepare prompt for Groq
    const prompt = `
You are an expert ATS (Applicant Tracking System) and Resume Analyzer.
Analyze the following resume text and provide a structured evaluation in JSON format exactly matching this schema, without any markdown formatting or extra text outside the JSON:

{
  "atsScore": (number out of 100),
  "summary": "(A brief professional summary of the candidate)",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "missingSkills": ["...", "..."],
  "technicalSkills": ["...", "..."],
  "softSkills": ["...", "..."],
  "suggestions": ["...", "..."],
  "jobRecommendations": ["...", "..."],
  "formattingFeedback": ["...", "..."],
  "keywordOptimization": ["...", "..."]
}

Resume Text:
"""
${text.substring(0, 5000)} 
"""
`;

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from Groq API");
    }

    // Parse the JSON response
    const analysis = JSON.parse(aiResponse);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try again later." },
      { status: 500 }
    );
  }
}
