/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Snow from "@/components/christmas/Snow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChristianCarousel from "@/components/website/christian_carousel";
import ExploreMorePages from "@/components/website/explore_pages";
import Footer from "@/components/website/footer";
import Header from "@/components/website/header";
import MatrixThemed from "@/components/website/matrix_themed";
import PinnedCarousel from "@/components/website/pinned_carousel";
import PrintablesCarousel from "@/components/website/printables_carousel";
import SocialMediaLinks from "@/components/website/socials";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { scrollY } = useScroll();

  const waveImageScale = useTransform(scrollY, [0, 200], [1, 1.5]);
  const waveImageOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  return (
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center dark:bg-slate-900">
      <Snow />
      <Header />
      <div className="overflow-x-hidden">
        <div className="max-w-screen w-full relative overflow-hidden">
          <motion.div
            style={{ scale: waveImageScale, opacity: waveImageOpacity }}
            className="absolute inset-0 z-10 flex flex-row items-center justify-center gap-4 p-8"
          >
            <Image
              src="/image/emoji/waving_hand.png"
              alt="waving hand"
              width={260}
              height={260}
              className="h-16 w-16 sm:h-16 sm:w-16 md:h-24 md:w-24 lg:h-32 lg:w-32"
              unoptimized
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <h1 className="text-7xl sm:text-7xl md:text-8xl lg:text-9xl text-black dark:text-white line-clamp-1 font-bold">
              Hi
            </h1>
          </motion.div>
          <div className="relative max-w-screen w-full overflow-hidden h-72 md:h-96">
            <MatrixThemed />
          </div>
        </div>
        <section className="flex flex-col items-center text-center p-16">
          <div className="mb-4 w-fit">
            <img
              src="/image/best_codes_logo_low_res.png"
              alt="logo"
              className="h-16 w-16 sm:h-16 sm:w-16 md:h-24 md:w-24 lg:h-32 lg:w-32 rounded-full"
            />
          </div>
          <h2 className="text-5xl sm:text-5xl md:text-6xl lg:text-8xl text-blue-500 font-bold mb-4">
            I&apos;m BestCodes
          </h2>

          <span className="text-xl sm:text-xl md:text-3xl lg:text-5xl text-blue-500">
            Christian, Coder, Creator
          </span>
        </section>
        <div className="h-fit w-full p-8">
          <div className="w-full sm:w-full md:w-3/4 lg:w-2/3">
            <Card className="dark:bg-slate-800 dark:border-none">
              <CardHeader>
                <CardTitle className="flex flex-row items-center gap-2">
                  <Image
                    src="/image/emoji/latin_cross.png"
                    alt="latin cross"
                    width={80}
                    height={80}
                    className="h-8 w-8 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-14 lg:w-14"
                    unoptimized
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                  <span className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl dark:text-white">
                    I&apos;m a <span className="text-blue-500">Christian</span>
                  </span>
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Sinner Saved by God&apos;s Grace
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-lg dark:text-white">
                <p>
                  I&apos;m a sinner saved by grace, redeemed by Christ&apos;s
                  love. Striving to live for God&apos;s glory and share His
                  message of hope. Imperfect but forgiven, growing in faith
                  daily.
                </p>
                <p>
                  I haven&apos;t published very many of my Christian or Bible
                  related projects yet. (I haven&apos;t published many of my
                  projects in general).
                </p>
                <p>
                  I am currently working on a few Bible apps, verse of the day
                  programs, etc. I&apos;ll publish them when I get around to
                  finishing them...
                </p>
                <div className="w-full flex justify-center items-center mt-4">
                  <ChristianCarousel />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="h-fit w-full flex justify-center items-center p-8">
          <div className="w-full sm:w-full md:w-3/4 lg:w-2/3">
            <Card className="dark:bg-slate-800 dark:border-none">
              <CardHeader>
                <CardTitle className="flex flex-row items-center gap-2">
                  <Image
                    src="/image/emoji/technologist.png"
                    alt="technologist"
                    width={80}
                    height={80}
                    className="h-8 w-8 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-14 lg:w-14"
                    unoptimized
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                  <span className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl dark:text-white">
                    I&apos;m a <span className="text-blue-500">Coder</span>
                  </span>
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Probably a bit obvious, credits to my username...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-lg dark:text-white">
                <p>
                  I love to code! I&apos;ve been coding for about{" "}
                  {new Date().getFullYear() - 2017} years now.
                </p>
                <p>
                  My programming journey began several years ago when I received
                  an{" "}
                  <Link
                    prefetch={true}
                    href="https://makeblock.com/products/buy-mbot"
                    className="text-blue-500"
                  >
                    mBot
                  </Link>{" "}
                  from a friend. The little robot was simple but very fun! The
                  graphic-based programming (based on Blockly by Google) made it
                  pretty easy to learn and understand coding concepts. Of
                  course, it&apos;s very limited! I wanted to learn more. You
                  run out of things to do with Blockly quite quickly.
                </p>
                <p>
                  Before receiving my mBot, I had already (barely) fiddled with
                  JavaScript a bit. I made a few simple HTML pages (following
                  tutorials like the famous &apos;Fav Drink&apos; on w3schools).
                  It was super fun but also super impractical! I wanted to make
                  my own useful website. Interactivity isn&apos;t everything!
                </p>
                <p>
                  It didn&apos;t take long for me to discover CSS. I fine-tuned
                  my styling skills with the help of AI. (Now, of course, I just
                  use frameworks with built in styling like TailwindCSS. It
                  makes things a lot more uniform and consistent.)
                </p>
                <p>
                  That&apos;s a nice summary of how I got started with web
                  development. I&apos;m a full-stack developer now, which, for
                  any non-programming viewers, basically means I make the
                  frontend things you appreciate (a website is frontend), and
                  the backend things you probably don&apos;t even know exist.
                  There&apos;s a lot that goes on behind the scenes!
                </p>
                <p>
                  I write most of my backend in Node.js, which is not surprising
                  (since I already had experience with JavaScript.)
                </p>
                <div className="w-full flex flex-col gap-4 justify-center items-center mt-4">
                  <span className="text-3xl flex flex-row items-center gap-2">
                    <Image
                      src="/image/emoji/pushpin.png"
                      alt="pushpin"
                      width={40}
                      height={40}
                      className="h-10 w-10"
                      unoptimized
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />
                    Pinned Projects
                  </span>
                  <PinnedCarousel />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="h-fit w-full flex justify-end items-end p-8">
          <div className="w-full sm:w-full md:w-3/4 lg:w-2/3">
            <Card className="dark:bg-slate-800 dark:border-none">
              <CardHeader>
                <CardTitle className="flex flex-row items-center gap-2">
                  <Image
                    src="/image/emoji/artist.png"
                    alt="artist"
                    width={80}
                    height={80}
                    className="h-8 w-8 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-14 lg:w-14"
                    unoptimized
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                  <span className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl dark:text-white">
                    I&apos;m a <span className="text-blue-500">Creator</span>
                  </span>
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  An uncreative catch-all word for everything else I do
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-lg dark:text-white">
                <p>
                  I design stuff. I create stuff. I{" "}
                  <Link
                    prefetch={true}
                    href="https://makerworld.com/en/@Best_codes"
                    className="text-blue-500"
                  >
                    print stuff.
                  </Link>
                </p>
                <p>
                  Once upon a time, I received a challenge - if I could learn to
                  3D design, the challenger would gift me a free 3D Printer.
                </p>
                <p>
                  How could I turn that down? I got right to work. I began 3D
                  modeling with Blender, which wasn&apos;t the easiest thing to
                  start with. Blender targets 3D animation / film production,
                  but thankfully there are plenty of tutorials on YouTube.
                </p>
                <p>
                  I usually use OnShape (a CAD software), but I&apos;m learning
                  a bit more mesh modeling and other softwares.
                </p>
                <p>
                  Here&apos;s a few of my &apos;Highlighed Models&apos; - and
                  no, the names aren&apos;t buggy or anything. My teams account
                  on Printables seems to love double-naming models. Appearently
                  it ranks models higher on the search.
                </p>
                <div className="w-full flex flex-col gap-4 justify-center items-center mt-4">
                  <PrintablesCarousel />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <section className="h-fit w-full flex justify-center items-center p-8 mt-32 dark:text-white">
          <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-row items-center justify-center gap-2">
              <Image
                src="/image/emoji/email.png"
                alt="email"
                width={80}
                height={80}
                className="h-8 w-8 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-14 lg:w-14"
                unoptimized
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <h1 className="text-center text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold">
                Where to <span className="text-blue-500">find me</span>
              </h1>
            </div>
            <SocialMediaLinks />
          </div>
        </section>
        <section className="h-fit w-full flex justify-center items-center p-8 mt-32">
          <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-row items-center justify-center gap-2">
              <Image
                src="/image/emoji/winking_face.png"
                alt="winking face"
                width={80}
                height={80}
                className="h-8 w-8 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-14 lg:w-14"
                unoptimized
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <h1 className="text-center text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold dark:text-white">
                That&apos;s all &mdash;{" "}
                <span className="text-blue-500">for now</span>
              </h1>
            </div>
            <p className="text-2xl w-3/4 sm:w-1/2 text-center dark:text-white">
              Maybe I&apos;ll add more to this site sometime. I don&apos;t know.
              For now, you can just check out some of my other pages on this
              site.
            </p>
          </div>
        </section>
      </div>
      <ExploreMorePages currentPath="/" />
      <Footer />
    </main>
  );
}
