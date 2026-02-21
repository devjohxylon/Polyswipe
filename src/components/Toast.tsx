"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "yes" | "no" | "star";
  visible: boolean;
}

const config = {
  yes: {
    bg: "bg-[var(--accent-green)]/20",
    border: "border-[var(--accent-green)]/40",
    text: "text-[var(--accent-green)]",
    icon: "♥",
  },
  no: {
    bg: "bg-[var(--accent-red)]/20",
    border: "border-[var(--accent-red)]/40",
    text: "text-[var(--accent-red)]",
    icon: "✕",
  },
  star: {
    bg: "bg-[var(--accent-blue)]/20",
    border: "border-[var(--accent-blue)]/40",
    text: "text-[var(--accent-blue)]",
    icon: "★",
  },
};

export default function Toast({ message, type, visible }: ToastProps) {
  const c = config[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full ${c.bg} border ${c.border} backdrop-blur-md`}
        >
          <span className={`${c.text} font-semibold text-sm flex items-center gap-2`}>
            <span className="text-lg">{c.icon}</span>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
