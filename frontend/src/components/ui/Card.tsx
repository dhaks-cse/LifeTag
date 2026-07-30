import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div";
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      whileHover={hover ? { y: -4 } : undefined}
      className={`rounded-2xl border border-slate-200 bg-white shadow-card transition-shadow ${
        hover ? "hover:shadow-soft" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;
