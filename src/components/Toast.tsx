"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "yes" | "no" | "star";
  visible: boolean;
}

const config = {
  yes: {
    gradient: "from-[var(--accent-green)]/25 to-[var(--accent-green)]/10",
    border: "border-[var(--accent-green)]/30",
    text: "text-[var(--accent-green)]",
    shadow: "shadow-[0_4px_20px_rgba(34,197,94,0.15)]",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  no: {
    gradient: "from-[var(--accent-red)]/25 to-[var(--accent-red)]/10",
    border: "border-[var(--accent-red)]/30",
    text: "text-[var(--accent-red)]",
    shadow: "shadow-[0_4px_20px_rgba(239,68,68,0.15)]",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  star: {
    gradient: "from-[var(--accent-blue)]/25 to-[var(--accent-purple)]/10",
    border: "border-[var(--accent-blue)]/30",
    text: "text-[var(--accent-blue)]",
    shadow: "shadow-[0_4px_20px_rgba(59,130,246,0.15)]",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
};

export default function Toast({ message, type, visible }: ToastProps) {
  const c = config[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-2xl bg-gradient-to-r ${c.gradient} border ${c.border} backdrop-blur-xl ${c.shadow}`}
        >
          <span className={`${c.text} font-bold text-sm flex items-center gap-2`}>
            {c.icon}
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
