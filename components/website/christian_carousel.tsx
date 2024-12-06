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

interface Project {
  name: string;
  url: string;
  description: string;
  coverImage: {
    src: string;
  };
}

export default function ChristianCarousel() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselData, setCarouselData] = useState<Project[]>([]);

  useEffect(() => {
    const url = `/api/github/repos-by-topic?username=The-Best-Codes&topic=christianity`;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCarouselData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Christian repos:", error);
        setError("Failed to load repositories. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="w-full max-w-40 md:max-w-xs mx-auto text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    (<Carousel
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
          (carouselData &&
            carouselData.map((project: Project) => (
              <CarouselItem key={project.name}>
                <Link
                  prefetch={true}
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
                    className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-lg"
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                  <h3 className="text-xl font-bold mt-4 text-center text-blue-500 hover:underline max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {project.name}
                  </h3>
                </Link>
              </CarouselItem>
            ))) || (
            <CarouselItem>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/image/not_found.png"
                  alt="Not Found"
                  width={256}
                  height={256}
                  className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-lg"
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
                <h3 className="text-xl font-bold mt-4 text-center text-blue-500 hover:underline">
                  Not Found
                </h3>
              </div>
            </CarouselItem>
          )
        )}
      </CarouselContent>
      <CarouselPrevious className="dark:bg-slate-900" />
      <CarouselNext className="dark:bg-slate-900" />
    </Carousel>)
  );
}
