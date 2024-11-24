import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { parse } from "node-html-parser";

interface ImageInfo {
  src: string;
  alt: string | null;
}

interface RepoImagesResponse {
  coverImage: ImageInfo | null;
  allImages: ImageInfo[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const repo = searchParams.get("repo");

  if (!username || !repo) {
    return NextResponse.json(
      { error: "Both GitHub username and repository name are required" },
      { status: 400 },
    );
  }

  try {
    // Fetch the README content
    const readmeUrl = `https://api.github.com/repos/${username}/${repo}/readme`;
    const readmeResponse = await axios.get(readmeUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3.html",
      },
    });

    const htmlContent = readmeResponse.data;
    const root = parse(htmlContent);

    // Find all images
    const images = root.querySelectorAll("img");

    let coverImage: ImageInfo | null = null;
    const allImages: ImageInfo[] = [];

    images.forEach((img) => {
      let src = img.getAttribute("src") || "";
      src = src.startsWith("http")
        ? src
        : `https://raw.githubusercontent.com/${username}/${repo}/main/${src}`;
      const alt = img.getAttribute("alt");
      const isForCover = img.getAttribute("for") === "cover";

      const imageInfo: ImageInfo = { src, alt: alt || null };

      if (isForCover && !coverImage) {
        coverImage = imageInfo;
      }

      allImages.push(imageInfo);
    });

    // If no cover image was specified, use the first image as cover
    if (!coverImage && allImages.length > 0) {
      coverImage = allImages[0];
    }

    const response: RepoImagesResponse = {
      coverImage,
      allImages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching repo images:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch repository images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
