import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, FolderOpen, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DeleteArticleDialog } from '@/components/article/DeleteArticleDialog';

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

      if (error) {
        console.error('Error fetching client:', error);
        throw error;
      }

      return data;
    },
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['client-articles', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      return data;
    },
  });

  if (isLoadingClient || isLoadingArticles) {
    return <div className="p-8">Loading...</div>;
  }

  if (!client) {
    return <div className="p-8">Client not found</div>;
  }

  // Group articles by month and year
  const groupedArticles = articles.reduce((groups, article) => {
    const date = new Date(article.created_at);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(article);
    return groups;
  }, {});

  // Sort groups by date (newest first)
  const sortedGroups = Object.entries(groupedArticles).sort((a, b) => b[0].localeCompare(a[0]));

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

        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to={`/client/${clientId}/dataset`}>
              <Button 
                className="flex items-center gap-2.5 bg-card text-foreground font-bold px-5 py-2.5 rounded-md
                         hover:bg-secondary/50 transition-colors duration-200 text-base border border-border"
              >
                <Database className="w-[22px] h-[22px]" />
                Dataset bewerken
              </Button>
            </Link>
            <Link to={`/create?client=${clientId}`}>
              <Button 
                className="flex items-center gap-2.5 bg-accent text-accent-foreground font-bold px-5 py-2.5 rounded-md
                         hover:bg-accent/90 transition-colors duration-200 text-base"
              >
                <Plus className="w-[22px] h-[22px]" />
                Artikel toevoegen
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {sortedGroups.map(([dateKey, groupArticles]) => {
            const [year, month] = dateKey.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            const monthName = new Intl.DateTimeFormat('nl-NL', { month: 'long' }).format(date);

            return (
              <Card key={dateKey} className="p-7 bg-card border border-border rounded-md">
                <h2 className="text-2xl font-semibold flex items-center gap-2.5 mb-7">
                  <FolderOpen className="w-7 h-7 text-accent" />
                  {monthName} {year}
                </h2>
                <div className="space-y-2.5">
                  {groupArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="flex items-center justify-between p-3.5 rounded-md transition-colors duration-200
                               text-muted-foreground hover:text-foreground group bg-secondary/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-7 h-7 text-accent" />
                        <span className="font-medium text-base group-hover:text-accent transition-colors duration-200">
                          {article.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-base">
                          {new Date(article.created_at).toLocaleDateString('nl-NL')}
                        </div>
                        <DeleteArticleDialog 
                          articleId={article.id} 
                          articleTitle={article.title}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}

          {sortedGroups.length === 0 && (
            <Card className="p-7 bg-card border border-border rounded-md">
              <div className="text-center text-muted-foreground py-8 text-base">
                Nog geen artikelen in deze map
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPage;