import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from '@/integrations/supabase/types';

type Article = Database['public']['Tables']['articles']['Row'];

interface ClientArticlesProps {
  articles: Article[];
  isLoading: boolean;
}

export const ClientArticles = ({ articles, isLoading }: ClientArticlesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artikelen</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading articles...</div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-opacity-80 transition-all"
              >
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Gepubliceerd op: {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-accent">{article.word_count} woorden</span>
              </div>
            ))}
            {articles.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                Nog geen artikelen voor deze klant
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};