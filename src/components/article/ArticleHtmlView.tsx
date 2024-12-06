import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ArticleHtmlViewProps {
  content: string;
}

export function ArticleHtmlView({ content }: ArticleHtmlViewProps) {
  return (
    <SyntaxHighlighter
      language="html"
      style={oneDark}
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        background: 'rgb(30, 30, 30)',
      }}
    >
      {content}
    </SyntaxHighlighter>
  );
}
