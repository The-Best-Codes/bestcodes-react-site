import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PagePathNames from "../../../public/assets/explore_pages/names.json";

/**
 * @swagger
 * /api/explore_pages:
 *   get:
 *     summary: Get all explore pages
 *     description: Returns a list of all explore pages
 *     responses:
 *       200:
 *         description: Successful response
 */
export const revalidate = 0;

export async function GET() {
  const pages = await getPages();
  return NextResponse.json(pages);
}

async function getPages() {
  const pagesDir = path.join(process.cwd(), "app");
  return await scanDirectory(pagesDir, "");
}

async function scanDirectory(
  dir: string,
  currentPath: string,
): Promise<{ name: string; path: string }[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const pages: { name: string; path: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      const subPages = await scanDirectory(fullPath, relativePath);
      pages.push(...subPages);
    } else if (entry.name === "page.tsx") {
      const pagePath = currentPath === "" ? "/" : `/${currentPath}`;
      pages.push({
        name: getPageName(pagePath),
        path: pagePath,
      });
    }
  }

  return pages;
}

function getPageName(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const defaultName =
    parts.length > 0 ? parts[parts.length - 1].replace(/-/g, " ") : "Home";

  return (
    PagePathNames.find(
      (page: { path: string; name: string }) => page.path === path,
    )?.name || defaultName
  );
}
