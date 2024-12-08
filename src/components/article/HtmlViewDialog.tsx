import React from 'react';
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArticleHtmlView } from './ArticleHtmlView';
import { useToast } from "@/components/ui/use-toast";

interface HtmlViewDialogProps {
  content: string;
}

export function HtmlViewDialog({ content }: HtmlViewDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        description: "HTML code gekopieerd naar klembord",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Kon HTML code niet kopiëren",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground transition-colors duration-200 gap-2"
        >
          <Code2 className="h-[18px] w-[18px]" />
          <span>HTML weergeven</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[800px] max-h-[80vh]">
        <DialogHeader className="flex-row justify-between items-center">
          <DialogTitle>HTML Code</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>{copied ? "Gekopieerd!" : "Kopiëren"}</span>
          </Button>
        </DialogHeader>
        <div className="mt-4 overflow-y-auto">
          <ArticleHtmlView content={content} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
