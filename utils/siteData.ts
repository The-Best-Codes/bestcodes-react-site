import fs from "fs";
import path from "path";

interface SiteData {
  version: string;
  dependencyCount: number;
  devDependencyCount: number;
  totalDependencies: number;
  nodeVersion: string;
  nextVersion: string;
  projectName: string;
  scriptCount: number;
  repoUrl: string;
  isTypeScript: boolean;
  hasESLint: boolean;
  hasPrettier: boolean;
  totalFileCount: number;
  totalLineCount: number;
}

export async function getSiteData(): Promise<SiteData> {
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
    throw new Error(
      `Failed to read package.json: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // Calculate statistics
  const stats: SiteData = {
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
    scriptCount: Object.keys(packageJson.scripts || {}).length,
    repoUrl: packageJson.repository ? packageJson.repository.url : null,
    isTypeScript: fs.existsSync(path.join(process.cwd(), "tsconfig.json")),
    hasESLint: fs.existsSync(path.join(process.cwd(), ".eslintrc.json")),
    hasPrettier: fs.existsSync(path.join(process.cwd(), ".prettierrc")),
    totalFileCount: getTotalFileCount(process.cwd()),
    totalLineCount: getTotalLineCount(process.cwd()),
  };

  return stats;
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
