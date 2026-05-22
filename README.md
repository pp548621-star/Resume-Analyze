# ResumeAI - AI Resume Analyzer

ResumeAI is a modern, sleek web application built with Next.js 15, Tailwind CSS, and the Groq API. It allows users to upload their resume in PDF format and receive an instant, AI-driven analysis of their ATS compatibility, skills, strengths, weaknesses, and actionable feedback.

## Features

- **Instant PDF Parsing:** Extracts text from uploaded PDF resumes directly on the server.
- **AI-Powered Analysis:** Leverages the Groq API (`llama-3.3-70b-versatile`) to generate a detailed ATS score, identify technical/soft skills, and offer actionable suggestions.
- **Modern Futuristic UI:** Glassmorphism dashboard, gradient backgrounds, and smooth Framer Motion animations.
- **Drag & Drop Upload:** Easy-to-use file upload zone with validation and visual feedback.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, Framer Motion, Lucide React Icons
- **UI Components:** Custom components inspired by shadcn/ui
- **PDF Extraction:** `pdf-parse`
- **AI Integration:** Groq API SDK

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/resumeai.git
   cd resumeai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Rename `.env.local.example` to `.env.local` and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Go to Vercel and create a new project, selecting your repository.
3. In the "Environment Variables" section, add `GROQ_API_KEY` and your actual key.
4. Click **Deploy**. Vercel will automatically build and deploy your application.

## Folder Structure
- `src/app/` - Next.js App Router layout, pages, global styles, and API route (`api/analyze`).
- `src/components/` - React components including Dashboard, UploadZone, and reusable UI components.
- `src/lib/` - Utilities (e.g., `utils.js` for tailwind class merging).
