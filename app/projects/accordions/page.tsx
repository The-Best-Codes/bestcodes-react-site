"use client";
import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  GripVertical,
  Trash2,
  Download,
  ArrowUpRightFromSquare,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

const AccordionEditor: React.FC = () => {
  const [header, setHeader] = useState("FAQ Title");
  const [subheader, setSubheader] = useState("Some rule");
  const [description, setDescription] = useState(
    "Below are some frequently asked questions..."
  );
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    setHtmlContent(getHTML());
  }, [header, subheader, description, items]);

  const addItem = () => {
    const newItem: AccordionItem = {
      id: `item-${Date.now()}`,
      question: "New Question",
      answer: "New Answer",
    };
    setItems([...items, newItem]);
  };

  const updateItem = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setItemToDelete(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  const getHTML = () => {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${header}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <style>
    .my-accordion .menu { background-color: #d5d5d5; color: #444; cursor: pointer; padding: 12px; width: 100%; text-align: left; border: none; outline: none; margin-top: 4px; border-radius: 8px; font-size: 1.5em; }
    .my-accordion .panel { background-color: #FFFFFF; color: #000000; overflow: hidden; }
    .my-accordion .open { display: block; }
    .my-accordion .close { display: none; }
    .my-accordion .active { background-color: #1b90bb; color: #fff; }
    .my-accordion .arrow { float: right; display: block; }
    .my-accordion .darrow { display: none; }
    .my-accordion .active .darrow { display: block; }
    .my-accordion .active .rarrow { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="jumbotron">
      <h1>${header}</h1>
      <h3><strong><span style="color:#FF0000;">${subheader}</span></strong></h3>
      <div><span style="font-size:18px;">${description}</span></div>
      <br />
      <div class="my-accordion">
`;

    items.forEach((item, index) => {
      html += `
        <button class="menu">${item.question}<span class="arrow rarrow">+</span><span class="arrow darrow">-</span></button>
        <div class="panel close">
          <div style="padding:10px">${item.answer}</div>
        </div>
`;
    });

    html += `
      </div>
    </div>
  </div>
  <script>
    !function(){for(var l=document.querySelectorAll(".my-accordion .menu"),e=0;e<l.length;e++)l[e].addEventListener("click",n);function n(){for(var e=document.querySelectorAll(".my-accordion .panel"),n=0;n<e.length;n++)e[n].className="panel close";if(-1==this.className.indexOf("active")){for(n=0;n<l.length;n++)l[n].className="menu";this.className="menu active",this.nextElementSibling.className="panel open"}else for(n=0;n<l.length;n++)l[n].className="menu"}}();
  </script>
</body>
</html>
`;

    return html;
  };

  const downloadHTML = () => {
    const html = getHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${header}.html`;
    link.href = url;
    link.click();
  };

  const openHTML = () => {
    const html = getHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      alert("HTML copied to clipboard!");
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row">
        <div
          className={`w-full ${showPreview ? "lg:w-1/2" : "lg:w-full"} lg:pr-4 max-h-screen overflow-auto p-4`}
        >
          {/* Editor Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Page Header</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="header">Main Header</Label>
              <Input
                id="header"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="mb-2"
              />
              <Label htmlFor="subheader">Subheader</Label>
              <Input
                id="subheader"
                value={subheader}
                onChange={(e) => setSubheader(e.target.value)}
                className="mb-2"
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-2"
              />
            </CardContent>
          </Card>
          <div className="w-full max-h-full overflow-auto p-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="items">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-4"
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-center mb-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2"
                                >
                                  <GripVertical className="text-gray-400" />
                                </div>
                                <Input
                                  value={item.question}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "question",
                                      e.target.value
                                    )
                                  }
                                  className="flex-grow"
                                  placeholder="Enter question"
                                />
                                <Dialog open={itemToDelete === item.id}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="ml-2"
                                      onClick={() => setItemToDelete(item.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Are you sure you want to delete this
                                        question?
                                      </DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setItemToDelete(null)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => deleteItem(item.id)}
                                      >
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <Textarea
                                value={item.answer}
                                onChange={(e) =>
                                  updateItem(item.id, "answer", e.target.value)
                                }
                                className="mt-2"
                                placeholder="Enter answer"
                              />
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className="flex flex-col flex-wrap">
            <Button onClick={addItem} className="my-4">
              Add New Question
            </Button>
            <div className="space-x-2 w-full flex flex-row items-center justify-start">
              <Button onClick={copyHTML}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button onClick={downloadHTML}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button onClick={openHTML}>
                <ArrowUpRightFromSquare className="w-4 h-4 mr-2" /> Open
              </Button>
              <Button onClick={() => setShowPreview(!showPreview)}>
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
          </div>
        </div>

        {showPreview && (
          <div className="w-full lg:w-1/2 lg:pl-4 mt-4 lg:mt-0">
            {/* Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  className="w-full h-[calc(100vh-200px)]"
                  srcDoc={htmlContent}
                  title="Output"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionEditor;
