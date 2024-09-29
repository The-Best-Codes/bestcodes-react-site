"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Header from "@/components/website/header";
import Footer from "@/components/website/footer";
import {
  AlertCircle,
  Package,
  Code,
  FileJson,
  GitBranch,
  Server,
  FileCode,
  FileCog,
  Files,
  Hash,
} from "lucide-react";

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

export default function SiteDataPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/site_data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSiteData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching site data:", error);
        setError("Failed to load site data. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!siteData) {
    return (
      <ErrorMessage message="No data available. Please try again later." />
    );
  }

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

function LoadingSkeleton() {
  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen w-full">
      <Header />
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Site Data
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg"
            >
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[250px] mb-2" />
                <Skeleton className="h-4 w-[200px] mb-2" />
                <Skeleton className="h-4 w-[180px] mb-2" />
                <Skeleton className="h-4 w-[220px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen w-full flex items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Error
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </main>
  );
}
