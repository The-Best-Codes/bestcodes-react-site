import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  ArrowUpRightFromSquare,
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
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600"
      onClick={onCopy}
    >
      <Copy className="w-4 h-4 mr-2" /> Copy HTML
    </Button>
    <Button
      variant="secondary"
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600"
      onClick={onDownload}
    >
      <Download className="w-4 h-4 mr-2" /> Download
    </Button>
    <Button
      variant="secondary"
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600"
      onClick={onOpen}
    >
      <ArrowUpRightFromSquare className="w-4 h-4 mr-2" /> Open
    </Button>
    <Button
      variant="secondary"
      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600"
      onClick={onPreviewToggle}
    >
      {showPreview ? (
        <>
          <EyeOff className="w-4 h-4 mr-2" /> Hide Preview
        </>
      ) : (
        <>
          <Eye className="w-4 h-4 mr-2" /> Show Preview
        </>
      )}
    </Button>
  </div>
);
