import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];

interface ClientDatasetDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDatasetDialog = ({ client, open, onOpenChange }: ClientDatasetDialogProps) => {
  const [dataset, setDataset] = useState(client.dataset);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (client?.dataset) {
      setDataset(client.dataset);
    }
  }, [client]);

  const updateDatasetMutation = useMutation({
    mutationFn: async (newDataset: string) => {
      const { data, error } = await supabase
        .from('clients')
        .update({ dataset: newDataset })
        .eq('id', client.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Dataset succesvol bijgewerkt");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['client', client.id] });
    },
    onError: (error) => {
      toast.error("Error updating dataset: " + error.message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Dataset Bewerken</DialogTitle>
        </DialogHeader>
        <Textarea
          value={dataset}
          onChange={(e) => setDataset(e.target.value)}
          className="min-h-[400px]"
          placeholder="Voer dataset in (ongeveer 2000 woorden)"
        />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button 
            onClick={() => updateDatasetMutation.mutate(dataset)}
            disabled={updateDatasetMutation.isPending}
          >
            {updateDatasetMutation.isPending ? "Bezig met opslaan..." : "Opslaan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};