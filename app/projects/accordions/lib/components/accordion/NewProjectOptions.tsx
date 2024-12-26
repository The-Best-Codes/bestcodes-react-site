import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilePlus, FileUp } from "lucide-react";

interface NewProjectOptionsProps {
  onCreateNew: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NewProjectOptions: React.FC<NewProjectOptionsProps> = ({
  onCreateNew,
  onFileUpload,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card className="dark:border-slate-700 dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onCreateNew}
          className="w-full dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <FilePlus className="w-4 h-4 mr-2" /> Create New
        </Button>
      </CardContent>
    </Card>

    <Card className="dark:border-slate-700 dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Import Existing File</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="file"
          accept=".html"
          id="fileInput"
          onChange={onFileUpload}
          className="hidden"
        />
        <Button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="w-full dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <FileUp className="w-4 h-4 mr-2" /> Upload File
        </Button>
      </CardContent>
    </Card>
  </div>
);
