import React from 'react';
import DOMPurify from 'dompurify';

interface ArticleContentProps {
  content: string;
  className?: string;
}

export const ArticleContent = ({ content, className = '' }: ArticleContentProps) => {
  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div 
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  );
};
