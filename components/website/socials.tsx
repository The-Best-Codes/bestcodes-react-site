import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SocialMediaLinks() {
  return (
    <Card className="w-1/2">
      <CardContent className="p-4 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-row w-full items-center justify-evenly gap-4">
          <Link href="https://github.com/The-Best-Codes" target="_blank">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/image/icons/github.svg"
                alt="github"
                width={400}
                height={400}
                className="h-36 w-36"
              />
              <span className="text-md text-blue-500">@The-Best-Codes</span>
            </div>
          </Link>
          <Link href="https://dev.to/best_codes" target="_blank">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/image/icons/devdotto.svg"
                alt="devdotto"
                width={400}
                height={400}
                className="h-36 w-36"
              />
              <span className="text-md text-blue-500">@best_codes</span>
            </div>
          </Link>
          <Link
            href="https://stackoverflow.com/users/20392792/best-codes"
            target="_blank"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/image/icons/stackoverflow.svg"
                alt="stackoverflow"
                width={400}
                height={400}
                className="h-36 w-36"
              />
              <span className="text-md text-blue-500">@best-codes</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-row w-full items-center justify-evenly gap-4">
          <Link href="https://codeium.com/profile/best_codes" target="_blank">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/image/icons/codeium.svg"
                alt="codeium"
                width={400}
                height={400}
                className="h-36 w-36"
              />
              <span className="text-md text-blue-500">@best_codes</span>
            </div>
          </Link>
          <Link href="https://discord.gg/HCZJVrrR" target="_blank">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/image/icons/discord.svg"
                alt="discord"
                width={400}
                height={400}
                className="h-36 w-36"
              />
              <span className="text-md text-blue-500">@best_codes</span>
            </div>
          </Link>
          <Link href="https://www.printables.com/@Best_codes" target="_blank">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/image/icons/printables.svg"
                alt="printables"
                width={400}
                height={400}
                className="h-36 w-36"
              />
              <span className="text-md text-blue-500">@Best_codes</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
