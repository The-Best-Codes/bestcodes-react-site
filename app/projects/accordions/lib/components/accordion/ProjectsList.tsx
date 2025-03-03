import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderOpen, Trash2 } from "lucide-react";
import { useState } from "react";
import { Project } from "../../types/accordion";

interface ProjectsListProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
}) => {
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  return (
    <Card className="mt-4 dark:border-slate-700 dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0
          ? (
            <p className="text-slate-500 dark:text-slate-400">
              No recent projects. Create a new one to get started!
            </p>
          )
          : (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900"
                >
                  <span className="font-medium dark:text-white">
                    {project.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => onOpenProject(project)}
                      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                    >
                      <FolderOpen className="w-4 h-4 mr-0 sm:mr-2" />
                      <span className="hidden sm:inline">Open</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setProjectToDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-0 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </CardContent>

      <Dialog
        open={!!projectToDelete}
        onOpenChange={() => setProjectToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (projectToDelete) {
                  onDeleteProject(projectToDelete);
                  setProjectToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
