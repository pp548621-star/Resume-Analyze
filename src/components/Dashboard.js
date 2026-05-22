"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, Briefcase, Code, UserCircle, Star } from "lucide-react"

const ScoreCircle = ({ score }) => {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  let colorClass = "text-red-500"
  if (score >= 70) colorClass = "text-yellow-500"
  if (score >= 85) colorClass = "text-green-500"

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="stroke-gray-800"
          strokeWidth="12"
          fill="transparent"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="80"
          cy="80"
          r={radius}
          className={`stroke-current ${colorClass}`}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </span>
        <span className="text-xs text-gray-400">ATS SCORE</span>
      </div>
    </div>
  )
}

const ListSection = ({ title, items, icon: Icon, colorClass }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h4 className="text-lg font-medium text-white">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <motion.li 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-start gap-2 text-sm text-gray-300 bg-gray-800/30 p-3 rounded-lg border border-gray-700/50"
          >
            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${colorClass}`} />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

const TagCloud = ({ title, tags, icon: Icon, colorClass }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h4 className="text-lg font-medium text-white">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * idx }}
            className={`px-3 py-1 text-xs font-medium rounded-full border bg-opacity-20 ${colorClass.replace('text-', 'bg-').replace('500', '500/20')} ${colorClass.replace('text-', 'border-').replace('500', '500/30')} text-white`}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export function Dashboard({ data }) {
  if (!data) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Left Column: Score and Summary */}
      <div className="md:col-span-1 space-y-6">
        <motion.div variants={item}>
          <Card className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-900/80 to-black/80">
            <ScoreCircle score={data.atsScore || 0} />
            <p className="mt-6 text-sm text-gray-400">
              Based on industry standards, keyword matches, and structural formatting.
            </p>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-blue-400" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 leading-relaxed">
                {data.summary}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Middle and Right Columns: Details */}
      <div className="md:col-span-2 space-y-6">
        {/* Skills Section */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <TagCloud 
                title="Technical Skills" 
                tags={data.technicalSkills} 
                icon={Code} 
                colorClass="text-blue-400" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <TagCloud 
                title="Soft Skills" 
                tags={data.softSkills} 
                icon={Star} 
                colorClass="text-purple-400" 
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Feedback Section */}
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <ListSection 
                title="Strengths" 
                items={data.strengths} 
                icon={CheckCircle2} 
                colorClass="text-green-500" 
              />
              <ListSection 
                title="Weaknesses / Missing" 
                items={[...(data.weaknesses || []), ...(data.missingSkills || [])]} 
                icon={XCircle} 
                colorClass="text-red-500" 
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Actionable Suggestions */}
        <motion.div variants={item}>
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="pt-6">
              <ListSection 
                title="Actionable Suggestions" 
                items={data.suggestions} 
                icon={AlertCircle} 
                colorClass="text-yellow-500" 
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Matches */}
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <TagCloud 
                title="Recommended Job Roles" 
                tags={data.jobRecommendations} 
                icon={Briefcase} 
                colorClass="text-emerald-400" 
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
