"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "yes" | "no" | "star";
  visible: boolean;
}

const config = {
  yes:  { bg: "var(--yes-dim)",  border: "rgba(34,197,94,0.25)",   text: "var(--yes)" },
  no:   { bg: "var(--no-dim)",   border: "rgba(239,68,68,0.25)",   text: "var(--no)" },
  star: { bg: "var(--blue-dim)", border: "rgba(91,106,255,0.25)",  text: "var(--blue)" },
};

export default function Toast({ message, type, visible }: ToastProps) {
  const c = config[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            padding: "8px 18px",
            borderRadius: 12,
            background: c.bg,
            border: `1px solid ${c.border}`,
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ color: c.text, fontWeight: 600, fontSize: 13 }}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
