import React from 'react';
import { Folder, FileText, Plus, UserPlus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useArticleStatusCheck } from '@/hooks/useArticleStatusCheck';
import { Card } from '@/components/ui/card';

type Client = Database['public']['Tables']['clients']['Row'];
type Article = Database['public']['Tables']['articles']['Row'];

// Type for joined article data
interface ArticleWithClient extends Article {
  client: Pick<Client, 'name'> | null;
}

const Index = () => {
  console.log('Index component mounted');
  
  // Check for incomplete articles on mount
  useArticleStatusCheck();

  // Fetch clients for the folders view
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*, articles(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      return data;
    }
  });

  // Fetch recent articles with client info
  const { data: recentArticles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['recent-articles'],
    queryFn: async () => {
      console.log('Fetching recent articles...');
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          client:clients(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      console.log('Recent articles:', data);
      return (data || []) as ArticleWithClient[];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-10 py-10 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-foreground">Content Dashboard</h1>
          <Link to="/create">
            <Button 
              className="flex items-center gap-2.5 bg-accent text-accent-foreground font-bold px-5 py-2.5 rounded-md
                         hover:bg-accent/90 transition-colors duration-200 text-base"
            >
              <Plus className="w-[22px] h-[22px]" />
              Artikel toevoegen
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Card className="p-7 bg-card border border-border rounded-md">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-2xl font-semibold flex items-center gap-2.5">
                <Folder className="w-7 h-7 text-accent" />
                Klant Mappen
              </h2>
              <Link to="/create-client">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-transparent">
                      <UserPlus className="w-6 h-6 text-accent" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-base">Nieuwe Klant Toevoegen</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </div>
            
            {isLoadingClients ? (
              <div className="py-8 text-center text-muted-foreground text-base">Laden...</div>
            ) : (
              <div className="space-y-2.5">
                {clients.map((client) => (
                  <Link
                    key={client.id}
                    to={`/client/${client.id}`}
                    className="flex items-center justify-between p-3.5 rounded-md transition-colors duration-200
                             text-muted-foreground hover:text-foreground group bg-secondary/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-7 h-7 text-accent" />
                      <span className="font-medium text-base">{client.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-base">
                      <span>{client.articles?.length || 0} artikelen</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-7 bg-card border border-border rounded-md">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-2xl font-semibold flex items-center gap-2.5">
                <FileText className="w-7 h-7 text-accent" />
                Recente Artikelen
              </h2>
            </div>

            {isLoadingArticles ? (
              <div className="py-8 text-center text-muted-foreground text-base">Laden...</div>
            ) : (
              <div className="space-y-2.5">
                {recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="block p-3.5 rounded-md transition-colors duration-200
                             hover:bg-secondary/10 group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-7 h-7 text-accent" />
                        <h3 className="font-bold text-base text-foreground group-hover:text-accent transition-colors duration-200">
                          {article.title}
                        </h3>
                      </div>
                      <span className="text-base text-accent">
                        {new Date(article.created_at).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;