import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Article {
  title: string;
  date: string;
  wordCount: number;
}

const ClientPage = () => {
  const { clientId } = useParams();
  const clientName = clientId?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Example data - in real app this would come from an API
  const articles: Article[] = [
    {
      title: "De Impact van Digitalisering op Zorgprocessen",
      date: "2024-02-25",
      wordCount: 1200
    },
    {
      title: "Innovatie in de Zorgsector: Een Overzicht",
      date: "2024-02-20",
      wordCount: 1500
    },
    {
      title: "Best Practices voor Zorgmanagement",
      date: "2024-02-15",
      wordCount: 1800
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-accent mb-6">
          <ArrowLeft size={20} />
          Terug naar dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{clientName}</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit2 size={16} />
            Dataset Bewerken
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recente Artikelen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-opacity-80 transition-all"
                >
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-gray-400">Gepubliceerd op: {article.date}</p>
                  </div>
                  <span className="text-sm text-accent">{article.wordCount} woorden</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPage;