"use client"

import { motion } from "framer-motion"
import { X, Github, Linkedin, Mail, MapPin, Briefcase } from "lucide-react"

interface ProfileModalProps {
  onClose: () => void
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#ffeaa7] to-[#fff3b0] rounded-2xl p-1 max-w-sm w-full shadow-2xl"
      >
        {/* Screen bezel */}
        <div className="bg-gradient-to-br from-[#a8e6cf] to-[#88d8b0] rounded-xl p-3">
          {/* Inner screen */}
          <div className="bg-[#e8e8e8] rounded-lg p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00b894] to-[#00cec9] rounded-lg p-1 shadow-lg">
                  <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
                    <rect x="4" y="1" width="8" height="2" fill="#2d3436" />
                    <rect x="3" y="2" width="1" height="2" fill="#2d3436" />
                    <rect x="12" y="2" width="1" height="2" fill="#2d3436" />
                    <rect x="4" y="3" width="8" height="6" fill="#fdcb6e" />
                    <rect x="5" y="4" width="2" height="2" fill="#2d3436" />
                    <rect x="9" y="4" width="2" height="2" fill="#2d3436" />
                    <rect x="5" y="4" width="1" height="1" fill="#fff" />
                    <rect x="9" y="4" width="1" height="1" fill="#fff" />
                    <rect x="6" y="7" width="4" height="1" fill="#e17055" />
                    <rect x="3" y="10" width="10" height="5" fill="#00b894" />
                    <rect x="2" y="11" width="2" height="4" fill="#00b894" />
                    <rect x="12" y="11" width="2" height="4" fill="#00b894" />
                    <rect x="6" y="10" width="4" height="1" fill="#00cec9" />
                  </svg>
                </div>
                <div>
                  <h2 className="pixel-text text-[10px] text-gray-800">Zhong Yongpeng</h2>
                  <p className="pixel-text text-[6px] text-gray-600 mt-1">Full-Stack Developer</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-6 h-6 bg-[#e74c3c] rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-3 h-3 text-white" />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "EXP", value: "3.5 YRS" },
                { label: "PROJECTS", value: "50+" },
                { label: "LEVEL", value: "SR" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg p-2 text-center shadow-sm">
                  <div className="pixel-text text-[6px] text-gray-500">{stat.label}</div>
                  <div className="pixel-text text-[8px] text-gray-800 mt-1">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-3 h-3" />
                <span className="pixel-text text-[7px]">Shenzhen or Shanghai</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-3 h-3" />
                <span className="pixel-text text-[7px]">Open to Opportunities</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="pixel-text text-[6px] text-gray-500 mb-2">SKILLS</div>
              <div className="flex flex-wrap gap-1">
                {["React", "TypeScript", "Next.js", "Node.js"].map((skill) => (
                  <span key={skill} className="pixel-text text-[6px] bg-[#00b894] text-white px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-3">
              {[
                { icon: Github, color: "#2d3436", href: "https://github.com/code-zyp1" },
                { icon: Linkedin, color: "#0077b5", href: "https://linkedin.com" },
                { icon: Mail, color: "#e74c3c", href: "mailto:zypzhong@qq.com" },
              ].map(({ icon: Icon, color, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
