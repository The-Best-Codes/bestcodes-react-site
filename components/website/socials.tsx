import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    href: "https://github.com/The-Best-Codes",
    icon: "github.svg",
    username: "@The-Best-Codes",
  },
  {
    href: "https://dev.to/best_codes",
    icon: "devdotto.svg",
    username: "@best_codes",
  },
  {
    href: "https://stackoverflow.com/users/20392792/best-codes",
    icon: "stackoverflow.svg",
    username: "@best-codes",
  },
  {
    href: "https://codeium.com/profile/best_codes",
    icon: "codeium.svg",
    username: "@best_codes",
  },
  {
    href: "https://discord.gg/dKeuR9yfBs",
    icon: "discord.svg",
    username: "@best_codes",
  },
  {
    href: "https://www.printables.com/@Best_codes",
    icon: "printables.svg",
    username: "@Best_codes",
  },
  {
    href: "https://x.com/the_best_codes",
    icon: "x.svg",
    username: "@the_best_codes",
  },
  {
    href: "mailto:best-codes@proton.me",
    icon: "email.svg",
    username: "Email Me",
  },
];

export default function SocialMediaLinks() {
  return (
    <Card className="w-full max-w-4xl mx-auto dark:bg-slate-700 dark:border-none">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {socialLinks.map((link, index) => (
            <Link key={index} href={link.href} target="_blank" prefetch={true}>
              <div className="flex flex-col items-center justify-center gap-2">
                <Image
                  src={`/image/icons/${link.icon}`}
                  alt={`${link.icon.split(".")[0]} icon`}
                  width={400}
                  height={400}
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 hover:scale-105 hover:drop-shadow-2xl transition-transform dark:invert"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <span className="text-sm sm:text-md text-blue-500 text-center">
                  {link.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
