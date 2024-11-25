import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];

interface ClientDeleteDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDeleteDialog = ({ client, open, onOpenChange }: ClientDeleteDialogProps) => {
  const navigate = useNavigate();

  const deleteClientMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Client succesvol verwijderd");
      navigate('/');
    },
    onError: (error) => {
      toast.error("Error deleting client: " + error.message);
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Weet je zeker dat je deze client wilt verwijderen?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Deze actie kan niet ongedaan worden gemaakt. Alle data van deze client zal permanent worden verwijderd.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuleren</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteClientMutation.mutate()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Verwijderen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};