import React from 'react';
import { Folder, FileText, Plus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: recentArticles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['recent-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          created_at,
          clients (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Content Dashboard</h1>
          <Link to="/create" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nieuw Artikel
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Folder className="text-accent" />
                Klant Mappen
              </h2>
              <Link to="/create">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoadingClients ? (
                <p>Loading...</p>
              ) : (
                clients.map((client) => (
                  <Link
                    key={client.id}
                    to={`/client/${client.id}`}
                    className="flex items-center gap-2 p-3 bg-background rounded card-hover"
                  >
                    <Folder size={20} className="text-accent" />
                    <span>{client.name}</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-card rounded p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-accent" />
              Recente Artikelen
            </h2>
            <div className="space-y-4">
              {isLoadingArticles ? (
                <p>Loading...</p>
              ) : (
                recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 bg-background rounded card-hover"
                  >
                    <div>
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-gray-400">{article.clients?.name}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;