import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ClientHeader } from '@/components/client/ClientHeader';
import { ClientArticles } from '@/components/client/ClientArticles';
import { ClientDatasetDialog } from '@/components/client/ClientDatasetDialog';
import { ClientDeleteDialog } from '@/components/client/ClientDeleteDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ClientPage = () => {
  const { clientId } = useParams();
  const [isEditingDataset, setIsEditingDataset] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['client-articles', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

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

        <ClientHeader 
          client={client}
          onEditDataset={() => setIsEditingDataset(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />

        <ClientArticles 
          articles={articles}
          isLoading={isLoadingArticles}
        />

        <ClientDatasetDialog
          client={client}
          open={isEditingDataset}
          onOpenChange={setIsEditingDataset}
        />

        <ClientDeleteDialog
          client={client}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        />
      </div>
    </div>
  );
};

export default ClientPage;