import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const DatasetPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading } = useQuery({
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

  const updateDatasetMutation = useMutation({
    mutationFn: async (dataset: string) => {
      const { error } = await supabase
        .from('clients')
        .update({ dataset })
        .eq('id', clientId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Dataset is opgeslagen');
    },
    onError: (error) => {
      toast.error('Error updating dataset: ' + error.message);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-10 py-10 max-w-[1400px] mx-auto">
          <div className="text-center text-muted-foreground text-base">Laden...</div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataset = formData.get('dataset') as string;
    updateDatasetMutation.mutate(dataset);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-10 py-10 max-w-[1400px] mx-auto">
        <Link 
          to={`/client/${clientId}`}
          className="flex items-center gap-2.5 text-accent hover:text-accent/90 
                     transition-colors duration-200 mb-12"
        >
          <ArrowLeft className="w-7 h-7" />
          <span className="text-lg">Terug naar klant</span>
        </Link>

        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <Database className="w-7 h-7 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Dataset van {client.name}</h1>
          </div>
        </div>

        <Card className="p-7 bg-card border border-border rounded-md">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2">
              <p className="text-base text-muted-foreground mb-7">
                Voer hier de dataset in voor {client.name}. Deze dataset wordt gebruikt om relevante content te genereren 
                die past bij het bedrijf. Voeg relevante informatie toe zoals producten, diensten, USP's, en andere 
                belangrijke kenmerken van het bedrijf.
              </p>
              <Textarea
                name="dataset"
                defaultValue={client.dataset || ''}
                className="h-[400px] text-base font-mono"
                placeholder="Voer hier de dataset in..."
              />
            </div>

            <Button
              type="submit"
              className="bg-accent text-accent-foreground font-bold px-5 py-2.5 rounded-md
                       hover:bg-accent/90 transition-colors duration-200 text-base h-11"
              disabled={updateDatasetMutation.isPending}
            >
              {updateDatasetMutation.isPending ? 'Opslaan...' : 'Dataset opslaan'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DatasetPage;
