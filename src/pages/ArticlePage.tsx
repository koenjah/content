import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { ArticleContent } from '@/components/article/ArticleContent';
import { Card } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import { FileText } from 'lucide-react';
import { DeleteArticleDialog } from '@/components/article/DeleteArticleDialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Code2 } from 'lucide-react';
import { ArticleHtmlView } from '@/components/article/ArticleHtmlView';
import { HtmlViewDialog } from '@/components/article/HtmlViewDialog';

type Article = Database['public']['Tables']['articles']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface ArticleWithClient extends Article {
  client: Pick<Client, 'name'> | null;
}

const ArticlePage = () => {
  const { articleId } = useParams();
  const [showHtml, setShowHtml] = React.useState(false);

  // Fetch article with client info
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          client:clients(*)
        `)
        .eq('id', articleId)
        .single();

      if (error) throw error;
      return data as ArticleWithClient;
    },
    enabled: !!articleId
  });

  // Fetch other articles from the same client
  const { data: clientArticles = [] } = useQuery({
    queryKey: ['client-articles', article?.client_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('client_id', article?.client_id)
        .neq('id', articleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!article?.client_id
  });

  if (isLoading) {
    return <div className="p-8">Loading article...</div>;
  }

  if (!article) {
    return <div className="p-8">Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-10 py-10 max-w-[1400px] mx-auto">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 text-accent hover:text-accent/90 
                     transition-colors duration-200 mb-12"
        >
          <ArrowLeft className="w-7 h-7" />
          <span className="text-lg">Terug naar dashboard</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="p-7 bg-card border border-border rounded-md">
              <h2 className="text-2xl font-semibold flex items-center gap-2.5 mb-7">
                <Folder className="w-7 h-7 text-accent" />
                Andere artikelen
              </h2>
              <div className="space-y-2.5">
                {clientArticles.map((clientArticle) => (
                  <Link
                    key={clientArticle.id}
                    to={`/article/${clientArticle.id}`}
                    className="flex items-center justify-between p-3.5 rounded-md transition-colors duration-200
                             text-muted-foreground hover:text-foreground group bg-secondary/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-7 h-7 text-accent" />
                      <span className="font-medium text-base group-hover:text-accent transition-colors duration-200">
                        {clientArticle.title}
                      </span>
                    </div>
                    <div className="text-base">
                      {new Date(clientArticle.created_at).toLocaleDateString('nl-NL')}
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-7 bg-card border border-border rounded-md">
            <div className="flex items-center justify-between gap-2.5 text-base text-accent mb-7">
              <div className="flex items-center gap-2.5">
                <span>{article.client?.name}</span>
                <span>•</span>
                <span>{new Date(article.created_at).toLocaleDateString('nl-NL')}</span>
                <span>•</span>
                <span>{article.word_count} woorden</span>
              </div>
              <div className="flex items-center gap-2">
                <HtmlViewDialog content={article.content} />
                <DeleteArticleDialog 
                  articleId={article.id} 
                  articleTitle={article.title}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive transition-colors duration-200 gap-2"
                    >
                      <Trash2 className="h-[18px] w-[18px]" />
                      <span>Verwijderen</span>
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="prose prose-invert max-w-none text-base">
              <ArticleContent content={article.content} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
