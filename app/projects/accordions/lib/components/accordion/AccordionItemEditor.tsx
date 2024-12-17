import { AccordionItem } from "../../types/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface AccordionItemEditorProps {
  item: AccordionItem;
  onUpdate: (id: string, field: "question" | "answer", value: string) => void;
  onDelete: (id: string) => void;
  dragHandleProps: any;
}

export const AccordionItemEditor: React.FC<AccordionItemEditorProps> = ({
  item,
  onUpdate,
  onDelete,
  dragHandleProps,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card className="mb-4 dark:border-slate-700 dark:bg-slate-800">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-move">
            <GripVertical className="text-slate-400" />
          </div>
          <div className="flex-1">
            <Input
              value={item.question}
              onChange={(e) => onUpdate(item.id, "question", e.target.value)}
              className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              placeholder="Enter question"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
        <Textarea
          value={item.answer}
          onChange={(e) => onUpdate(item.id, "answer", e.target.value)}
          className="mt-4 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
          placeholder="Enter answer"
        />

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Question</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this question? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(item.id);
                  setIsDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
