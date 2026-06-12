"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const katexOptions = {
  throwOnError: false,
  strict: "ignore" as const,
  errorColor: "#f87171",
};

export function MarkdownContent({ content }: { content: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="prose-cyber whitespace-pre-wrap text-gray-300">
        {content}
      </div>
    );
  }

  return (
    <div className="prose-cyber">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, katexOptions]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
