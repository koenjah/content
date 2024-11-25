import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];

interface ClientHeaderProps {
  client: Client;
  onEditDataset: () => void;
  onDelete: () => void;
}

export const ClientHeader = ({ client, onEditDataset, onDelete }: ClientHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-white">{client.name}</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onEditDataset}
        >
          <Edit2 size={16} />
          Dataset Bewerken
        </Button>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2"
          onClick={onDelete}
        >
          <Trash2 size={16} />
          Verwijderen
        </Button>
      </div>
    </div>
  );
};