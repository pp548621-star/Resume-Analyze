"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { UploadZone } from "@/components/UploadZone"
import { Dashboard } from "@/components/Dashboard"

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)

  return (
    <div className="min-h-screen relative flex flex-col pb-20">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/50 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              ResumeAI
            </span>
          </div>
          <div className="text-sm text-gray-400 font-medium">
            Pro Analysis
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-20">
        {/* Hero Section */}
        {!analysisResult && (
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-white"
            >
              Elevate your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Career Potential
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400"
            >
              Upload your resume and let our advanced AI analyze your ATS compatibility, uncover missing skills, and suggest actionable improvements instantly.
            </motion.p>
          </div>
        )}

        {/* Upload Zone */}
        {!analysisResult && (
          <UploadZone onAnalyze={setAnalysisResult} />
        )}

        {/* Dashboard Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Your Analysis Report</h2>
              <button 
                onClick={() => setAnalysisResult(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Upload New Resume
              </button>
            </div>
            <Dashboard data={analysisResult} />
          </motion.div>
        )}
      </main>
    </div>
  )
}
