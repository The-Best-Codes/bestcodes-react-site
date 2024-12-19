import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * @swagger
 * /api/site_data:
 *   get:
 *     summary: Get site data
 *     description: Returns site data such as version, dependency counts, and other project information.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   description: Project version
 *                 dependencyCount:
 *                   type: number
 *                   description: Number of dependencies
 *                 devDependencyCount:
 *                   type: number
 *                   description: Number of dev dependencies
 *                 totalDependencies:
 *                   type: number
 *                   description: Total number of dependencies
 *                 nodeVersion:
 *                   type: string
 *                   description: Node.js version
 *                 nextVersion:
 *                   type: string
 *                   description: Next.js version
 *                 projectName:
 *                   type: string
 *                   description: Project name
 *                 author:
 *                   type: string
 *                   description: Project author
 *                 license:
 *                   type: string
 *                   description: Project license
 *                 scriptCount:
 *                   type: number
 *                   description: Number of scripts
 *                 repoUrl:
 *                   type: string
 *                   description: Repository URL
 *                 mainFile:
 *                   type: string
 *                   description: Main file
 *                 isTypeScript:
 *                   type: boolean
 *                   description: Whether the project uses TypeScript
 *                 hasESLint:
 *                   type: boolean
 *                   description: Whether the project uses ESLint
 *                 hasPrettier:
 *                   type: boolean
 *                   description: Whether the project uses Prettier
 *                 totalFileCount:
 *                   type: number
 *                   description: Total number of files
 *                 totalLineCount:
 *                   type: number
 *                   description: Total number of lines
 *       500:
 *         description: Failed to generate site data
 */
export async function GET() {
  try {
    // Read package.json using file descriptor
    const packageJsonPath = path.join(process.cwd(), "package.json");
    let packageJson;
    try {
      const fd = fs.openSync(packageJsonPath, "r");
      try {
        const buffer = fs.readFileSync(fd);
        packageJson = JSON.parse(buffer.toString("utf8"));
      } finally {
        fs.closeSync(fd);
      }
    } catch (error: unknown) {
      throw new Error(`Failed to read package.json: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Calculate statistics
    const stats = {
      version: packageJson.version,
      dependencyCount: Object.keys(packageJson.dependencies || {}).length,
      devDependencyCount: Object.keys(packageJson.devDependencies || {}).length,
      totalDependencies:
        Object.keys(packageJson.dependencies || {}).length +
        Object.keys(packageJson.devDependencies || {}).length,
      nodeVersion: process.version,
      nextVersion:
        packageJson.dependencies["next"] || packageJson.devDependencies["next"],
      projectName: packageJson.name,
      author: packageJson.author,
      license: packageJson.license,
      scriptCount: Object.keys(packageJson.scripts || {}).length,
      repoUrl: packageJson.repository ? packageJson.repository.url : null,
      mainFile: packageJson.main,
      isTypeScript: fs.existsSync(path.join(process.cwd(), "tsconfig.json")),
      hasESLint: fs.existsSync(path.join(process.cwd(), ".eslintrc.json")),
      hasPrettier: fs.existsSync(path.join(process.cwd(), ".prettierrc")),
      totalFileCount: getTotalFileCount(process.cwd()),
      totalLineCount: getTotalLineCount(process.cwd()),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error generating site data:", error);
    return NextResponse.json(
      { error: "Failed to generate site data" },
      { status: 500 }
    );
  }
}

function getTotalFileCount(dir: string): number {
  let count = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      count += getTotalFileCount(filePath);
    } else if (stat.isFile()) {
      count++;
    }
  }

  return count;
}

function getTotalLineCount(dir: string): number {
  let count = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (error) {
      console.warn(`Failed to stat file ${filePath}:`, error);
      continue;
    }

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      count += getTotalLineCount(filePath);
    } else if (stat.isFile() && !file.startsWith(".")) {
      try {
        // Open file with read-only flag
        const fd = fs.openSync(filePath, "r");
        try {
          // Read the entire file using the file descriptor
          const buffer = fs.readFileSync(fd);
          const content = buffer.toString("utf8");
          count += content.split("\n").length;
        } finally {
          // Always close the file descriptor
          fs.closeSync(fd);
        }
      } catch (error) {
        console.warn(`Failed to read file ${filePath}:`, error);
      }
    }
  }

  return count;
}
