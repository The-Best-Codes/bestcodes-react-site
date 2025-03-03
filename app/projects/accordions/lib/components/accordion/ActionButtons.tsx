import { Button } from "@/components/ui/button";
import {
  ArrowUpRightFromSquare,
  Copy,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";

interface ActionButtonsProps {
  onCopy: () => void;
  onDownload: () => void;
  onOpen: () => void;
  showPreview: boolean;
  onPreviewToggle: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopy,
  onDownload,
  onOpen,
  showPreview,
  onPreviewToggle,
}) => (
  <div className="flex flex-wrap gap-2">
    <Button
      variant="secondary"
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600 hidden sm:flex"
      onClick={onCopy}
    >
      <Copy className="w-4 h-4 mr-0 sm:mr-2" />{" "}
      <span className="sr-only sm:not-sr-only">Copy HTML</span>
    </Button>
    <Button
      variant="secondary"
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600"
      onClick={onDownload}
    >
      <Download className="w-4 h-4 mr-0 sm:mr-2" />{" "}
      <span className="sr-only sm:not-sr-only">Download</span>
    </Button>
    <Button
      variant="secondary"
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600 hidden sm:flex"
      onClick={onOpen}
    >
      <ArrowUpRightFromSquare className="w-4 h-4 mr-0 sm:mr-2" />{" "}
      <span className="sr-only sm:not-sr-only">Open</span>
    </Button>
    <Button
      variant="secondary"
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600"
      onClick={onPreviewToggle}
    >
      {showPreview
        ? (
          <>
            <EyeOff className="w-4 h-4 mr-0 sm:mr-2" />{" "}
            <span className="sr-only sm:not-sr-only">Hide Preview</span>
          </>
        )
        : (
          <>
            <Eye className="w-4 h-4 mr-0 sm:mr-2" />{" "}
            <span className="sr-only sm:not-sr-only">Show Preview</span>
          </>
        )}
    </Button>
  </div>
);
