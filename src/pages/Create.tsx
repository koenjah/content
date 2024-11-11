import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Create = () => {
  const [clientName, setClientName] = useState('');
  const [dataset, setDataset] = useState('');
  const navigate = useNavigate();

  const createClientMutation = useMutation({
    mutationFn: async ({ name, dataset }: { name: string; dataset: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ name, dataset }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Klant succesvol aangemaakt!");
      navigate(`/client/${data.id}`);
    },
    onError: (error) => {
      toast.error("Fout bij het aanmaken van de klant: " + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !dataset.trim()) {
      toast.error("Vul alle velden in");
      return;
    }
    createClientMutation.mutate({ name: clientName, dataset });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-accent mb-8">
          <ArrowLeft size={20} />
          Terug naar overzicht
        </Link>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Nieuwe klant toevoegen</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                Klantnaam <span className="text-accent">*</span>
              </label>
              <Input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Voer klantnaam in"
              />
            </div>

            <div>
              <label className="block mb-2">
                Dataset <span className="text-accent">*</span>
              </label>
              <Textarea
                className="h-64"
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                placeholder="Voer dataset in (ongeveer 2000 woorden)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Huidige lengte: {dataset.split(/\s+/).filter(Boolean).length} woorden
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createClientMutation.isPending}
            >
              {createClientMutation.isPending ? "Bezig met aanmaken..." : "Klant Aanmaken"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Create;