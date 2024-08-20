import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "react-tilt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";

interface Page {
  name: string;
  path: string;
}

const defaultTiltOptions = {
  reverse: false,
  max: 35,
  perspective: 1000,
  scale: 1.1,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

const ExploreMorePages: React.FC<{ currentPath: string }> = ({
  currentPath,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://api.github.com/repos/The-Best-Codes/bestcodes-react-site/contents/app"
        );
        const items = response.data;

        const pagesPromises = items.map(async (item: any) => {
          if (item.type === "file" && item.name === "page.tsx") {
            return { name: "Home", path: "/" };
          } else if (item.type === "dir") {
            const folderContents = await axios.get(item.url);
            const hasPageFile = folderContents.data.some(
              (file: any) => file.name === "page.tsx"
            );

            if (hasPageFile) {
              return { name: item.name, path: `/${item.name}` };
            }

            const nestedPagesPromises = folderContents.data
              .filter((subItem: any) => subItem.type === "dir")
              .map(async (subItem: any) => {
                const subFolderContents = await axios.get(subItem.url);
                if (
                  subFolderContents.data.some(
                    (file: any) => file.name === "page.tsx"
                  )
                ) {
                  return {
                    name: `${item.name} - ${subItem.name}`,
                    path: `/${item.name}/${subItem.name}`,
                  };
                }
                return null;
              });

            const nestedPages = await Promise.all(nestedPagesPromises);
            return nestedPages.filter((page): page is Page => page !== null);
          }
          return null;
        });

        const pagesResults = await Promise.all(pagesPromises);
        const validPages = pagesResults
          .flat()
          .filter((page): page is Page => page !== null);
        setPages(validPages.filter((page) => page.path !== currentPath));
      } catch (error) {
        console.error("Error fetching pages:", error);
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
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {pages.map((page, index) => (
              <motion.div
                key={page.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Tilt options={defaultTiltOptions}>
                  <Card className="h-full bg-white dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 transform hover:shadow-xl dark:hover:shadow-gray-700 dark:hover:shadow-md">
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
                        className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600 dark:hover:bg-slate-600 transition-colors duration-200 flex-shrink-0"
                      >
                        <a href={page.path} className="flex items-center">
                          Visit <ChevronRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ExploreMorePages;
