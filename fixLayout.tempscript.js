const fs = require('fs').promises;
const path = require('path');
const prettier = require('prettier');

async function findLayoutFiles(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    let layoutFiles = [];

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            layoutFiles = layoutFiles.concat(await findLayoutFiles(fullPath));
        } else if (file.name === 'layout.tsx') {
            layoutFiles.push(fullPath);
        }
    }

    return layoutFiles;
}

async function convertLayoutFile(filePath) {
    try {
        let content = await fs.readFile(filePath, 'utf8');

        // Replace import statement
        content = content.replace(
            'import { Inter } from "next/font/google";',
            'import localFont from "next/font/local";'
        );

        // Remove Inter font initialization
        content = content.replace(/const inter = Inter\([^)]+\);/, '');

        // Calculate relative path from layout file to fonts directory
        const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'app', 'fonts'));
        const fontPath = path.join(relativePath, path.sep).replace(/\\/g, '/');

        // Add local font initializations with correct relative paths
        const fontInit = `
const geistSans = localFont({
  src: "${fontPath}GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "${fontPath}GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
`;
        content = content.replace(/(export const metadata)/, `${fontInit}$1`);

        // Update body className
        content = content.replace(
            'className={inter.className}',
            'className={`${geistSans.variable} ${geistMono.variable}`}'
        );

        // Format the content with Prettier
        const formattedContent = await prettier.format(content, {
            filepath: filePath,
            parser: 'typescript',
        });

        await fs.writeFile(filePath, formattedContent, 'utf8');
        console.log(`Converted and formatted: ${filePath}`);
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

async function main() {
    const appDir = path.join(process.cwd(), 'app');
    const layoutFiles = await findLayoutFiles(appDir);

    for (const file of layoutFiles) {
        await convertLayoutFile(file);
    }

    console.log('All layout.tsx files have been processed.');
}

main().catch(console.error);