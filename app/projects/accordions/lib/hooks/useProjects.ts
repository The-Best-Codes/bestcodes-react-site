import { useState, useEffect } from "react";
import { Project } from "../types/accordion";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem("accordionProjects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem("accordionProjects", JSON.stringify(updatedProjects));
  };

  const addProject = (project: Project) => {
    const updatedProjects = [...projects, project];
    saveProjects(updatedProjects);
  };

  const updateProject = (project: Project) => {
    const updatedProjects = projects.map((p) =>
      p.id === project.id ? project : p,
    );
    saveProjects(updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    saveProjects(updatedProjects);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };
};
