import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function ChristianCarousel() {
  const [isLoading, setIsLoading] = useState(true);
  const [carouselData, setCarouselData] = useState<any>([]);

  useEffect(() => {
    const projects = [
      {
        id: 1,
        name: "bc-BibleVerse.js",
        image:
          "https://raw.githubusercontent.com/The-Best-Codes/bc-BibleVerse/main/assets/bible.png",
        link: "https://github.com/The-Best-Codes/bc-BibleVerse",
      },
    ]; // Replace with API call in the future

    setCarouselData(projects);
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-full object-cover" />
      ) : (
        <Carousel className="max-w-full">
          <CarouselContent>
            {carouselData.map((project: any) => (
              <Link
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener"
              >
                <CarouselItem>
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={300}
                    height={300}
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <h3 className="text-2xl font-bold mt-4 text-center text-blue-500 hover:underline">
                    {project.name}
                  </h3>
                </CarouselItem>
              </Link>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </>
  );
}
