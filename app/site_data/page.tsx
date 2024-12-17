import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Header from "@/components/website/header";
import Footer from "@/components/website/footer";
import {
	AlertCircle,
	Package,
	Code,
	FileJson,
	Server,
	FileCode,
	FileCog,
	Hash,
} from "lucide-react";
import { headers } from "next/headers";

export const revalidate = 0;

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

async function getSiteData(): Promise<SiteData> {
	const headersList = await headers();
	const host = headersList.get("host") || "localhost:3000";
	const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
	const response = await fetch(`${protocol}://${host}/api/site_data`, {
		cache: "no-store",
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`HTTP error! status: ${response.status}, body: ${errorText}`,
		);
	}

	const data = await response.json();
	return data;
}

export default async function SiteDataPage() {
	let siteData: SiteData;

	try {
		siteData = await getSiteData();
	} catch (error) {
		console.error("Page: Error in SiteDataPage:", error);
		return (
			<main className="bg-slate-100 dark:bg-slate-900 min-h-screen w-full flex items-center justify-center">
				<div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
						Error
					</h2>
					<p className="text-gray-600 dark:text-gray-300">
						Failed to load site data. Please try again later.
					</p>
				</div>
			</main>
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
