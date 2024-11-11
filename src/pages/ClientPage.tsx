import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ClientPage = () => {
  const { clientId } = useParams();

  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast.error("Error loading client: " + error.message);
    }
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articles', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast.error("Error loading articles: " + error.message);
    }
  });

  if (isLoadingClient) {
    return <div className="p-8">Loading client...</div>;
  }

  if (!client) {
    return <div className="p-8">Client not found</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-accent mb-6">
          <ArrowLeft size={20} />
          Terug naar dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{client.name}</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit2 size={16} />
            Dataset Bewerken
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recente Artikelen</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingArticles ? (
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
      </div>
    </div>
  );
};

export default ClientPage;