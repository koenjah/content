import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CreateClient = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const [dataset, setDataset] = useState("");

  const createClientMutation = useMutation({
    mutationFn: async ({ name, dataset }: { name: string; dataset: string }) => {
      const { data, error } = await supabase
        .from("clients")
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
      toast.error("Error creating client: " + error.message);
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
              Aantal woorden: {dataset.split(/\s+/).filter(Boolean).length}
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
      </div>
    </div>
  );
};

export default CreateClient;