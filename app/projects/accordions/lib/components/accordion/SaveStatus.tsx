import { Button } from "@/components/ui/button";
import { Save, Loader2, Check } from "lucide-react";

interface SaveStatusProps {
  status: "idle" | "saving" | "success";
  onSave: () => void;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ status, onSave }) => (
  <Button
    onClick={onSave}
    className="dark:bg-slate-700 dark:hover:bg-slate-600"
    disabled={status === "saving"}
  >
    {status === "idle" ? (
      <Save className="w-4 h-4 mr-2" />
    ) : status === "saving" ? (
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    ) : (
      <Check className="w-4 h-4 mr-2" />
    )}
    {status === "saving"
      ? "Saving..."
      : status === "success"
        ? "Saved"
        : "Save"}
  </Button>
);
