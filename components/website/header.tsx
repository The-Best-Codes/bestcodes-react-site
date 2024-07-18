import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Header() {
  const { scrollYProgress } = useScroll();

  const headerWidth = useTransform(scrollYProgress, [0, 0.2], ["100%", "80%"]);
  const headerBorderRadius = useTransform(scrollYProgress, [0, 0.3], [0, 50]);
  const logoBorderRadius = useTransform(scrollYProgress, [0, 0.3], [5, 20]);
  const headerTop = useTransform(scrollYProgress, [0, 0.1], [0, 50]);

  return (
    <motion.div
      className="fixed left-0 right-0 h-16 z-50"
      style={{
        width: headerWidth,
        borderRadius: headerBorderRadius,
        left: "50%",
        x: "-50%",
        top: headerTop,
      }}
    >
      {/* Backdrop element */}
      <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg" style={{ borderRadius: 'inherit' }}></div>

      {/* Content */}
      <header className="relative h-full flex items-center justify-between px-6">
        <div className="flex flex-row items-center gap-4">
          <Link href="/">
            <div className="flex flex-row w-fit items-center gap-4">
              <motion.img
                src={`/image/best_codes_logo_low_res.png`}
                alt="logo"
                width={40}
                height={40}
                className="h-8 w-8"
                style={{
                  borderRadius: logoBorderRadius,
                }}
              />
            </div>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="/"
                  className="text-black text-2xl dark:text-white hover:text-blue-500 hover:underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-black text-2xl dark:text-white hover:text-blue-500 hover:underline"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-black text-2xl dark:text-white hover:text-blue-500 hover:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-row items-center gap-4">
          <a
            href="https://github.com/the-best-codes"
            className="text-black dark:text-white hover:text-blue-500 hover:underline"
          >
            GitHub
          </a>
        </div>
      </header>
    </motion.div>
  );
}