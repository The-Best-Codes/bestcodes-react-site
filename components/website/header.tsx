import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  const scrollRange = [0, 200];
  const headerWidth = useTransform(scrollY, scrollRange, ["100%", "80%"]);
  const headerTop = useTransform(scrollY, scrollRange, ["0px", "25px"]);
  const headerBorderRadius = useTransform(scrollY, scrollRange, [0, 32]);
  const logoBorderRadius = useTransform(scrollY, scrollRange, [5, 20]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavItems = () => (
    <ul className={`flex ${isMobile ? "flex-col space-y-4" : "space-x-4"}`}>
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
          href="https://dev.to/best_codes"
          className="text-black text-2xl dark:text-white hover:text-blue-500 hover:underline"
        >
          Blog
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
  );

  return (
    <motion.div
      className="sticky z-50 mx-auto"
      style={{
        width: headerWidth,
        top: headerTop,
      }}
    >
      <motion.div
        className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg overflow-hidden"
        style={{
          borderRadius: headerBorderRadius,
        }}
      >
        <header className="h-16 flex items-center justify-between px-6">
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
            {!isMobile && (
              <nav>
                <NavItems />
              </nav>
            )}
          </div>
          {isMobile ? (
            <button onClick={toggleMenu} className="text-2xl">
              {isMenuOpen ? (
                <X className="dark:invert" />
              ) : (
                <Menu className="dark:invert" />
              )}
            </button>
          ) : (
            <div className="flex flex-row items-center gap-4">
              <Link target="_blank" href={`https://github.com/the-best-codes`}>
                <Image
                  src={`/image/icons/github.svg`}
                  alt="github"
                  width={40}
                  height={40}
                  className="h-8 w-8 dark:invert"
                />
              </Link>
              <Link target="_blank" href={`https://dev.to/best_codes`}>
                <Image
                  src={`/image/icons/devdotto.svg`}
                  alt="twitter"
                  width={40}
                  height={40}
                  className="h-8 w-8 dark:invert"
                />
              </Link>
            </div>
          )}
        </header>
        {isMobile && (
          <motion.div
            initial="closed"
            animate={isMenuOpen ? "open" : "closed"}
            variants={{
              open: { maxHeight: "500px", opacity: 1 },
              closed: { maxHeight: 0, opacity: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <nav className="px-6 py-4">
              <NavItems />
            </nav>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}