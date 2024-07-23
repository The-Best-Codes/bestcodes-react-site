import React, { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-http";
import "prismjs/components/prism-bash";
import { Copy, Check, X } from "lucide-react";

const SyntaxHighlighter = ({ language, children, className }: any) => {
  const [copyStatus, setCopyStatus] = useState("idle");

  useEffect(() => {
    Prism.highlightAll();
  }, [children, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 1000);
    } catch (err) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 1000);
    }
  };

  const renderCopyButton = () => {
    switch (copyStatus) {
      case "success":
        return <Check className="w-5 h-5" />;
      case "error":
        return <X className="w-5 h-5" />;
      default:
        return <Copy className="w-5 h-5" />;
    }
  };

  const isMultiline = children.split("\n").length > 1;

  return (
    <div className={`relative`}>
      <pre
        className={`language-${language} ${
          isMultiline ? "p-4" : "p-2"
        } rounded-lg ${className}`}
      >
        <code>{children}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        disabled={copyStatus !== "idle"}
        className={`absolute ${
          isMultiline
            ? "top-2 right-2"
            : "top-1/2 right-2 transform -translate-y-1/2"
        } p-2 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400`}
      >
        {renderCopyButton()}
      </button>
    </div>
  );
};

export default SyntaxHighlighter;
