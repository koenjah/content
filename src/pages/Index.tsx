import React from 'react';
import { Folder, FileText, Plus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type Article = Database['public']['Tables']['articles']['Row'] & {
  clients: Pick<Client, 'name'>;
};

const Index = () => {
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Error loading clients: " + error.message);
      }
    }
  });

  const { data: recentArticles = [], isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ['recent-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          clients:client_id (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Transform the data to match our Article type
      return (data || []).map(article => ({
        ...article,
        clients: article.clients as Pick<Client, 'name'>
      }));
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Error loading articles: " + error.message);
      }
    }
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Content Dashboard</h1>
          <Link to="/create">
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Nieuw Artikel
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Folder className="text-accent" />
                Klant Mappen
              </h2>
              <Link to="/create-client">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <UserPlus size={18} className="text-accent" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nieuwe Klant Toevoegen</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </div>
            
            {isLoadingClients ? (
              <div>Loading clients...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clients.map((client) => (
                  <Link
                    key={client.id}
                    to={`/client/${client.id}`}
                    className="flex items-center gap-2 p-3 bg-background rounded hover:bg-muted/50 transition-colors"
                  >
                    <Folder size={20} className="text-accent" />
                    <span>{client.name}</span>
                  </Link>
                ))}
                {clients.length === 0 && (
                  <p className="text-muted-foreground col-span-2 text-center py-4">
                    Nog geen klanten toegevoegd
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-accent" />
              Recente Artikelen
            </h2>
            {isLoadingArticles ? (
              <div>Loading articles...</div>
            ) : (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 bg-background rounded hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">{article.clients?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-accent">{article.word_count} woorden</span>
                      <p className="text-sm text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentArticles.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nog geen artikelen aangemaakt
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;