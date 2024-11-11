import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Error loading clients: " + error.message);
      }
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: async ({ title, content, clientId }: { title: string; content: string; clientId: string }) => {
      const wordCount = content.trim().split(/\s+/).length;
      
      const { data, error } = await supabase
        .from("articles")
        .insert([
          {
            title,
            content,
            client_id: clientId,
            word_count: wordCount
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Artikel succesvol aangemaakt!");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Error creating article: " + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedClientId) {
      toast.error("Vul alle velden in");
      return;
    }
    createArticleMutation.mutate({ title, content, clientId: selectedClientId });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nieuw Artikel</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">
              Klant <span className="text-accent">*</span>
            </label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een klant" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">
              Titel <span className="text-accent">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Voer titel in"
            />
          </div>

          <div>
            <label className="block mb-2">
              Content <span className="text-accent">*</span>
            </label>
            <Textarea
              className="h-64"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Voer content in"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Aantal woorden: {content.trim().split(/\s+/).filter(Boolean).length}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createArticleMutation.isPending}
          >
            {createArticleMutation.isPending ? "Bezig met aanmaken..." : "Artikel Aanmaken"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;