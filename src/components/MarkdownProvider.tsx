import Markdown from "react-markdown";
import { CodeComponent } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

const MarkdownProvider = ({ content }: { content: string }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: Code,
        p: ({ ...props }) => {
          return <p className=" break-words" {...props} />;
        },
        h1: ({ ...props }) => {
          return <h1 className="text-2xl font-bold" {...props} />;
        },
        h2: ({ ...props }) => {
          return <h2 className="text-xl font-bold" {...props} />;
        },
        h3: ({ ...props }) => {
          return <h3 className="text-lg font-bold" {...props} />;
        },
        h4: ({ ...props }) => {
          return <h4 className="text-base font-bold" {...props} />;
        },
        h5: ({ ...props }) => {
          return <h5 className="text-sm font-bold" {...props} />;
        },
        h6: ({ ...props }) => {
          return <h6 className="text-xs font-bold" {...props} />;
        },
        blockquote: ({ ...props }) => {
          return (
            <blockquote
              className="border-l-4 border-gray-300 pl-4"
              {...props}
            />
          );
        },
        ul: ({ ...props }) => {
          return <ul className="list-disc break-words pl-8" {...props} />;
        },
        ol: ({ ...props }) => {
          return <ol className="list-decimal break-words pl-8" {...props} />;
        },
        li: ({ ...props }) => {
          return <li className="my-2 break-words" {...props} />;
        },
        table: ({ ...props }) => {
          return <table className="border-collapse border" {...props} />;
        },
        thead: ({ ...props }) => {
          return <thead className="border border-red-300" {...props} />;
        },
        tbody: ({ ...props }) => {
          return <tbody className="border border-red-200" {...props} />;
        },
        tr: ({ ...props }) => {
          return <tr className=" bg-red-300" {...props} />;
        },
        th: ({ ...props }) => {
          return <th className="border border-gray-300" {...props} />;
        },
        td: ({ ...props }) => {
          return <td className="whitespace-nowrap px-6 py-4" {...props} />;
        },
        img: ({ ...props }) => {
          return <img className="max-w-full" {...props} />;
        },
        a: ({ ...props }) => {
          return <a className="text-blue-500" {...props} />;
        },
        pre: ({ ...props }) => {
          return (
            <pre
              className="overflow-x-auto rounded-md bg-gray-100 p-4"
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};

const Code: CodeComponent = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");

  if (inline || !match) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1>{match[1]}</h1>
        <button>copy</button>
      </div>
      <SyntaxHighlighter style={oneDark} language={match[1]}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

export default MarkdownProvider;
