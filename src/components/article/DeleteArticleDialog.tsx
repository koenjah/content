import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface DeleteArticleDialogProps {
  articleId: string;
  articleTitle: string;
  onDeleted?: () => void;
  trigger?: React.ReactNode;
}

export function DeleteArticleDialog({ 
  articleId, 
  articleTitle,
  onDeleted,
  trigger 
}: DeleteArticleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // First delete related article_jobs records
      const { error: jobsError } = await supabase
        .from('article_jobs')
        .delete()
        .eq('article_id', articleId);

      if (jobsError) throw jobsError;

      // Then delete the article
      const { error: articleError } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (articleError) throw articleError;

      toast.success('Artikel is verwijderd');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
      
      if (onDeleted) {
        onDeleted();
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Error deleting article: ' + error.message);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors duration-200"
          >
            <Trash2 className="h-[18px] w-[18px]" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Artikel verwijderen</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Weet je zeker dat je het artikel &quot;{articleTitle}&quot; wilt verwijderen? 
            Dit kan niet ongedaan worden gemaakt.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="bg-secondary/50 hover:bg-secondary text-foreground"
          >
            Annuleren
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
