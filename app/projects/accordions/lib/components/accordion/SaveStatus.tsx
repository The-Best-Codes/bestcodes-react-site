import { Button } from "@/components/ui/button";
import { Check, Loader2, Save } from "lucide-react";

interface SaveStatusProps {
  status: "idle" | "saving" | "success";
  onSave: () => void;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ status, onSave }) => (
  <Button
    onClick={onSave}
    className="dark:bg-slate-700 dark:hover:bg-slate-600 gap-2 flex flex-row justify-center items-center"
    disabled={status !== "idle"}
  >
    {status === "idle" ? (
      <Save className="w-4 h-4" />
    ) : status === "saving" ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      <Check className="w-4 h-4" />
    )}
    <span className="sr-only sm:not-sr-only">
      {status === "saving"
        ? "Saving..."
        : status === "success"
          ? "Saved"
          : "Save"}
    </span>
  </Button>
);
