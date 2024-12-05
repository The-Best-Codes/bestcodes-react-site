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
import { MagicCard } from "@/components/ui/magic-card";
import { ChevronRight, Loader2, AlertCircle, ChevronLeft } from "lucide-react";

interface Page {
  name: string;
  path: string;
}

const ExploreMorePages: React.FC<{
  currentPath: string;
  className?: string;
}> = ({ currentPath, className }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const CARDS_PER_PAGE = 6;

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

  const totalPages = Math.ceil(pages.length / CARDS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const displayedPages = pages.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE,
  );

  return (
    <section className={`mt-16 mb-8 px-4 max-w-7xl mx-auto ${className || ""}`}>
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Explore More Pages
      </h2>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="h-16 w-16 animate-spin text-gray-900 dark:text-gray-100" />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
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
            key="no-pages"
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
            key="page-cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPages.map((page, index) => (
                <PageCard key={page.path} page={page} index={index} />
              ))}
            </div>
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                variant="outline"
                size="sm"
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2 hidden sm:block"> Previous</span>
              </Button>
              <span className="text-gray-500 dark:text-gray-400">
                <span className="sr-only sm:not-sr-only">Page</span>{" "}
                {currentPage + 1} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                variant="outline"
                size="sm"
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
              >
                <span className="mr-2 hidden sm:block">Next </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const PageCard: React.FC<{ page: Page; index: number }> = ({ page, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <MagicCard
        className="group relative rounded-xl bg-white dark:bg-slate-800 dark:border-slate-600 shadow-md overflow-hidden"
        childrenClassName="w-full"
        gradientColor="rgb(14, 165, 233)"
        gradientOpacity={0.15}
      >
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
      </MagicCard>
    </motion.div>
  );
};

export default ExploreMorePages;
