import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isVisible) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    } else {
      controls.start({ y: 20, opacity: 0 });
    }
  }, [isVisible, controls]);

  return (
    <footer className="bg-white dark:bg-slate-900 py-8 w-full">
      <div className="px-4 w-full">
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Best Codes. All rights reserved.
          </p>
        </div>
      </div>
      <motion.button
        aria-label="Scroll to top"
        type="button"
        role="button"
        title="Scroll to top"
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg transition-shadow duration-300"
        onClick={scrollToTop}
        initial={{ y: 20, opacity: 0 }}
        animate={controls}
        whileHover={{
          scale: 1.1,
          rotate: 360,
          backgroundColor: "#3B82F6",
          boxShadow: "0 0 8px rgb(59, 130, 246)",
        }}
        whileTap={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{
          duration: 0.5,
          scale: {
            type: "spring",
            stiffness: 300,
          },
        }}
      >
        <motion.div
          animate={{
            y: [-2, 2, -2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </footer>
  );
}
