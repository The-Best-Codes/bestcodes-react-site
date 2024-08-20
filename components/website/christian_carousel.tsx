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
    const url = `/api/github/repos-by-topic?username=The-Best-Codes&topic=christianity`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCarouselData(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full max-w-40 md:max-w-xs mx-auto"
    >
      <CarouselContent>
        {isLoading ? (
          <CarouselItem>
            <div className="flex flex-col items-center justify-center">
              <Skeleton className="w-32 h-32 md:w-64 md:h-64 rounded-lg" />
              <Skeleton className="w-24 md:w-48 h-10 mt-4" />
            </div>
          </CarouselItem>
        ) : (
          carouselData.map((project: any) => (
            <CarouselItem key={project.name}>
              <Link
                href={project.url}
                target="_blank"
                rel="noopener"
                className="flex flex-col items-center justify-center"
              >
                <Image
                  src={project?.coverImage?.src || "/image/not_found.png"}
                  alt={`${project.name} cover image`}
                  width={256}
                  height={256}
                  unoptimized
                  className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-lg"
                />
                <h3 className="text-xl font-bold mt-4 text-center text-blue-500 hover:underline max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {project.name}
                </h3>
              </Link>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious className="dark:bg-slate-900" />
      <CarouselNext className="dark:bg-slate-900" />
    </Carousel>
  );
}
