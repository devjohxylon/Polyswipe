"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "yes" | "no" | "star";
  visible: boolean;
}

const config = {
  yes: { bg: "bg-[var(--poly-green-bg)]", text: "text-[var(--poly-green)]" },
  no: { bg: "bg-[var(--poly-red-bg)]", text: "text-[var(--poly-red)]" },
  star: { bg: "bg-[var(--poly-blue)]/15", text: "text-[var(--poly-blue)]" },
};

export default function Toast({ message, type, visible }: ToastProps) {
  const c = config[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-lg ${c.bg} border border-[var(--border)]`}
        >
          <span className={`${c.text} font-medium text-[13px]`}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
