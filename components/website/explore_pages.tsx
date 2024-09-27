import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, AlertCircle } from "lucide-react";

interface Page {
  name: string;
  path: string;
}

const ExploreMorePages: React.FC<{ currentPath: string }> = ({
  currentPath,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/explore_pages");
        const allPages = response.data;
        setPages(allPages.filter((page: Page) => page.path !== currentPath));
      } catch (error) {
        console.error("Error fetching pages:", error);
        setError("Failed to fetch pages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [currentPath]);

  return (
    <section className="mt-16 mb-8 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Explore More Pages
      </h2>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="h-16 w-16 animate-spin text-gray-900 dark:text-gray-100" />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center h-64"
          >
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-center text-red-500">{error}</p>
          </motion.div>
        ) : pages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <p className="text-center text-gray-500 dark:text-gray-400">
              No other pages available to explore.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {pages.map((page, index) => (
              <PageCard key={page.path} page={page} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const PageCard: React.FC<{ page: Page; index: number }> = ({ page, index }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="group relative rounded-xl bg-white dark:bg-slate-800 shadow-md overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                150px circle at ${mouseX}px ${mouseY}px,
                rgba(14, 165, 233, 0.15),
                transparent 80%
              )
            `,
          }}
        />
        <Card className="h-full border-0 bg-transparent">
          <CardHeader>
            <CardTitle
              className="text-xl text-gray-800 dark:text-gray-100 truncate"
              title={page.name}
            >
              {page.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <p
              className="text-sm text-gray-500 dark:text-gray-400 truncate flex-grow mr-2"
              title={page.path}
            >
              {page.path}
            </p>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200 flex-shrink-0"
            >
              <a href={page.path} className="flex items-center">
                Visit <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ExploreMorePages;
