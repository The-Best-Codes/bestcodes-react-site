import { Menu, X /* User, Loader2 */ } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
//import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import UnderlineText from "@/components/website/underline-text";

export default function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  //const { isLoaded, isSignedIn, user } = useUser();

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

  /* const AuthButton = () => {
    if (!isLoaded) {
      return <Loader2 className="w-6 h-6 dark:text-white animate-spin" />;
    }

    if (isSignedIn) {
      return <UserButton />;
    }

    return (
      <SignInButton mode="modal">
        <Button
          aria-label="Sign in"
          title="Sign in"
          variant="outline"
          className="rounded-full dark:text-white dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white"
          size={"icon"}
        >
          <User />
        </Button>
      </SignInButton>
    );
  }; */

  const NavItems = () => (
    <ul className={`flex ${isMobile ? "flex-col space-y-4" : "space-x-4"}`}>
      <li>
        <Link
          prefetch={true}
          href="/"
          className="text-black text-2xl dark:text-white hover:text-blue-500 hover:underline"
        >
          <UnderlineText
            color="#3b82f6"
            animationDuration={300}
            activationType="hover"
          >
            Home
          </UnderlineText>
        </Link>
      </li>
      <li>
        <Link
          prefetch={true}
          href="https://dev.to/best_codes"
          className="text-black text-2xl dark:text-white hover:text-blue-500 hover:underline"
        >
          <UnderlineText
            color="#3b82f6"
            animationDuration={300}
            activationType="hover"
          >
            Blog
          </UnderlineText>
        </Link>
      </li>
      <li>
        <Link
          prefetch={true}
          href="/contact"
          className="text-black text-2xl dark:text-white hover:text-blue-500"
        >
          <UnderlineText
            color="#3b82f6"
            animationDuration={300}
            activationType="hover"
          >
            Contact
          </UnderlineText>
        </Link>
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
        className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs shadow-lg overflow-hidden"
        style={{
          borderRadius: headerBorderRadius,
        }}
      >
        <header className="h-16 flex items-center justify-between px-6">
          <div className="flex flex-row items-center gap-4">
            <Link prefetch={true} href="/">
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
          {isMobile
            ? (
              <Button
                aria-label="Menu"
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-2xl text-black dark:text-white"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            )
            : (
              <div className="flex flex-row items-center gap-4">
                <Link
                  target="_blank"
                  href={`https://github.com/the-best-codes`}
                  prefetch={true}
                >
                  <Image
                    src={`/image/icons/github.svg`}
                    alt="github"
                    width={40}
                    height={40}
                    className="h-8 w-8 dark:invert"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Link>
                <Link
                  target="_blank"
                  href={`https://dev.to/best_codes`}
                  prefetch={true}
                >
                  <Image
                    src={`/image/icons/devdotto.svg`}
                    alt="twitter"
                    width={40}
                    height={40}
                    className="h-8 w-8 dark:invert"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Link>
                {/* <AuthButton /> */}
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
              <div className="mt-4 flex flex-row items-center gap-4">
                {/* <AuthButton /> */}
              </div>
            </nav>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
