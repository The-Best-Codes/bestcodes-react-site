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
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <Link href="https://github.com/The-Best-Codes" target="_blank">
            <Image
              src="/image/icons/github.svg"
              alt="github"
              width={40}
              height={40}
              className="h-8 w-8"
            />
          </Link>
          <Link href="https://dev.to/best_codes" target="_blank">
            <Image
              src="/image/icons/devdotto.svg"
              alt="devdotto"
              width={40}
              height={40}
              className="h-8 w-8"
            />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
