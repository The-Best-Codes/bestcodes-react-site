/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ArrowLeft, Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { AccordionItemEditor } from "./lib/components/accordion/AccordionItemEditor";
import { ActionButtons } from "./lib/components/accordion/ActionButtons";
import { HeaderSection } from "./lib/components/accordion/HeaderSection";
import { NewProjectOptions } from "./lib/components/accordion/NewProjectOptions";
import { Preview } from "./lib/components/accordion/Preview";
import { ProjectsList } from "./lib/components/accordion/ProjectsList";
import { SaveStatus } from "./lib/components/accordion/SaveStatus";
import { useProjects } from "./lib/hooks/useProjects";
import type { AccordionItem, Project } from "./lib/types/accordion";
import { generateHTML } from "./lib/utils/html-generator";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mt-4">
    {message}
  </div>
);

const AccordionEditor: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [header, setHeader] = useState("FAQ Title");
  const [subheader, setSubheader] = useState("Some rule");
  const [description, setDescription] = useState(
    "Below are some frequently asked questions...",
  );
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  const [savingStatus, setSavingStatus] = useState<
    "saving" | "idle" | "success"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { projects, addProject, updateProject, deleteProject } = useProjects();

  // Update HTML content when editor content changes
  useEffect(() => {
    if (showEditor) {
      setHtmlContent(generateHTML(header, subheader, description, items));
    }
  }, [header, subheader, description, items, showEditor]);

  // Auto-save functionality
  useEffect(() => {
    if (currentProject) {
      const autoSave = setInterval(() => {
        handleSave();
      }, 60000); // Auto-save every minute

      return () => clearInterval(autoSave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject]);

  const handleSave = () => {
    setSavingStatus("saving");
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        name: header,
        header,
        subheader,
        description,
        items,
      };
      updateProject(updatedProject);
      setSavingStatus("success");
      setTimeout(() => setSavingStatus("idle"), 2000);
    }
  };

  const handleCreateNew = () => {
    try {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: "New Project",
        header: "FAQ Title",
        subheader: "Some rule",
        description: "Below are some frequently asked questions...",
        items: [],
      };
      setIsLoading(true);
      setError(null);
      setCurrentProject(newProject);
      setHeader(newProject.header);
      setSubheader(newProject.subheader);
      setDescription(newProject.description);
      setItems(newProject.items);
      addProject(newProject);
      setShowEditor(true);
    } catch {
      setError("Failed to create new project");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentProject) {
      setHeader(currentProject.header);
      setSubheader(currentProject.subheader);
      setDescription(currentProject.description);
      setItems(currentProject.items);
      setHtmlContent(
        generateHTML(
          currentProject.header,
          currentProject.subheader,
          currentProject.description,
          currentProject.items,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        const headerElement = doc.querySelector("h1");
        const subheaderElement = doc.querySelector("h3 strong span");
        const descriptionElement = doc.querySelector(".jumbotron div span");
        const accordionItems = doc.querySelectorAll(".my-accordion .menu");

        const newItems: AccordionItem[] = Array.from(accordionItems).map(
          (item, index) => ({
            id: `item-${index}`,
            question: item.textContent?.replace(/[+\-]/g, "").trim() || "",
            answer:
              item.nextElementSibling
                ?.querySelector("div")
                ?.innerHTML?.trim() || "",
          }),
        );

        const newProject: Project = {
          id: `project-${Date.now()}`,
          name: file.name.replace(".html", ""),
          header: headerElement?.textContent || "FAQ Title",
          subheader: subheaderElement?.textContent || "Some rule",
          description:
            descriptionElement?.textContent ||
            "Below are some frequently asked questions...",
          items: newItems,
        };

        setCurrentProject(newProject);
        setHeader(newProject.header);
        setSubheader(newProject.subheader);
        setDescription(newProject.description);
        setItems(newProject.items);
        addProject(newProject);
        setShowEditor(true);
      };
      reader.readAsText(file);
    }
  };

  const handleAddItem = () => {
    const newItem: AccordionItem = {
      id: `item-${Date.now()}`,
      question: "New Question",
      answer: "New Answer",
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (
    id: string,
    field: "question" | "answer",
    value: string,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${header}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenPreview = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url);
    URL.revokeObjectURL(url);
  };

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      alert("HTML copied to clipboard!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Failed to copy HTML to clipboard");
    }
  };

  if (!showEditor) {
    return (
      <main className="min-h-screen flex justify-center w-full p-6 space-y-6 dark:bg-slate-900 dark:text-slate-300">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Accordion Editor</h1>
          <NewProjectOptions
            onCreateNew={handleCreateNew}
            onFileUpload={handleFileUpload}
          />
          <ProjectsList
            projects={projects}
            onOpenProject={(project: Project) => {
              setCurrentProject(project);
              setHeader(project.header);
              setSubheader(project.subheader);
              setDescription(project.description);
              setItems(project.items);
              setShowEditor(true);
            }}
            onDeleteProject={deleteProject}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-auto sm:overflow-hidden w-full dark:bg-slate-900 dark:text-slate-300">
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      <div className="fixed top-4 left-4 z-10">
        <Button
          variant="outline"
          onClick={() => setShowEditor(false)}
          className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-800 dark:text-white dark:hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only sm:not-sr-only">Back</span>
        </Button>
      </div>
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <ActionButtons
          onCopy={handleCopyHTML}
          onDownload={handleDownload}
          onOpen={handleOpenPreview}
          showPreview={showPreview}
          onPreviewToggle={() => setShowPreview(!showPreview)}
        />
        <SaveStatus status={savingStatus} onSave={handleSave} />
      </div>

      <div className="container mx-auto pt-16 pb-8 px-4 flex flex-col h-full">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <div
            className={`w-full ${
              showPreview ? "lg:w-1/2" : "lg:w-full"
            } flex flex-col h-full`}
          >
            <div className="space-y-6 grow mb-2">
              <HeaderSection
                header={header}
                subheader={subheader}
                description={description}
                onHeaderChange={setHeader}
                onSubheaderChange={setSubheader}
                onDescriptionChange={setDescription}
              />
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="items">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4 overflow-y-auto min-h-40 max-h-[calc(100vh-36rem)]" // Add scroll and max-h
                    >
                      {items.length === 0 && (
                        <div className="text-center p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
                          <p className="text-slate-500 dark:text-slate-400">
                            No questions added yet. Click the &quot;Add New
                            Question&quot; button below to get started.
                          </p>
                        </div>
                      )}
                      {items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <AccordionItemEditor
                                item={item}
                                onUpdate={handleUpdateItem}
                                onDelete={handleDeleteItem}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <div className="space-y-4 sticky bottom-2">
              <Button
                onClick={handleAddItem}
                className="w-full dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Add New Question
              </Button>
            </div>
          </div>

          {showPreview && (
            <div className="w-full lg:w-1/2">
              <Preview htmlContent={htmlContent} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AccordionEditor;
