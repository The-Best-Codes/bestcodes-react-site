import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Header() {
  const { scrollY } = useScroll();

  // Define the scroll range for the transition (200 pixels)
  const scrollRange = [0, 200];

  const headerWidth = useTransform(scrollY, scrollRange, ["100%", "80%"]);
  const headerTop = useTransform(scrollY, scrollRange, ["0px", "25px"]);
  const headerBorderRadius = useTransform(scrollY, scrollRange, [0, 50]);
  const logoBorderRadius = useTransform(scrollY, scrollRange, [5, 20]);

  return (
    <motion.div
      className="sticky h-16 z-50 mx-auto"
      style={{
        width: headerWidth,
        borderRadius: headerBorderRadius,
        top: headerTop,
      }}
    >
      {/* Backdrop element */}
      <div
        className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg"
        style={{ borderRadius: "inherit" }}
      ></div>

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
                  href="/blog"
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
          </nav>
        </div>
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
      </header>
    </motion.div>
  );
}
