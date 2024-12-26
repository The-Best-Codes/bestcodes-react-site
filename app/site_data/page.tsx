import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/website/footer";
import Header from "@/components/website/header";
import { getSiteData } from "@/utils/siteData";
import {
  Code,
  FileCode,
  FileCog,
  FileJson,
  Hash,
  Package,
  Server,
} from "lucide-react";
import Link from "next/link";

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

export async function generateStaticParams() {
  return [{}];
}

export default async function SiteDataPage() {
  const siteData = await getSiteData();

  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen w-full">
      <Header />
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Site Data
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            title="Project Overview"
            icon={<FileJson className="w-6 h-6" />}
          >
            <p>
              <strong>Name:</strong> {siteData.projectName}
            </p>
            <p>
              <strong>Version:</strong> {siteData.version}
            </p>
            <p>
              <strong>Repository:</strong>{" "}
              <Link
                prefetch={true}
                href={siteData.repoUrl}
                className="text-blue-500 hover:underline block max-w-full truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteData.repoUrl}
              </Link>
            </p>
          </InfoCard>

          <InfoCard title="Dependencies" icon={<Package className="w-6 h-6" />}>
            <p>
              <strong>Total:</strong> {siteData.totalDependencies}
            </p>
            <p>
              <strong>Runtime Dependencies:</strong> {siteData.dependencyCount}
            </p>
            <p>
              <strong>Dev Dependencies:</strong> {siteData.devDependencyCount}
            </p>
            <p>
              <strong>Scripts:</strong> {siteData.scriptCount}
            </p>
          </InfoCard>

          <InfoCard title="Environment" icon={<Server className="w-6 h-6" />}>
            <p>
              <strong>Node.js:</strong> {siteData.nodeVersion}
            </p>
            <p>
              <strong>Next.js:</strong> {siteData.nextVersion}
            </p>
            <div className="mt-2">
              <Badge variant="default" className="mr-2">
                {siteData.isTypeScript ? (
                  <FileCode className="w-4 h-4 inline mr-1" />
                ) : (
                  <Code className="w-4 h-4 inline mr-1" />
                )}
                {siteData.isTypeScript ? "TypeScript" : "JavaScript"}
              </Badge>
              {siteData.hasESLint && (
                <Badge variant="default" className="mr-2">
                  <FileCog className="w-4 h-4 inline mr-1" />
                  ESLint
                </Badge>
              )}
              {siteData.hasPrettier && (
                <Badge variant="default">
                  <FileCog className="w-4 h-4 inline mr-1" />
                  Prettier
                </Badge>
              )}
            </div>
          </InfoCard>

          <InfoCard title="Project Metrics" icon={<Hash className="w-6 h-6" />}>
            <p>
              <strong>Total Files:</strong>{" "}
              {siteData.totalFileCount.toLocaleString()}
            </p>
            <p>
              <strong>Total Lines:</strong>{" "}
              {siteData.totalLineCount.toLocaleString()}
            </p>
          </InfoCard>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function InfoCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-600 dark:text-gray-300">
        {children}
      </CardContent>
    </Card>
  );
}
