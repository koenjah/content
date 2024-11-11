import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';

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

  // Dummy data for demonstration
  const recentArticles: Article[] = [
    { title: "SEO Strategieën 2024", date: "2024-02-20", wordCount: 1500 },
    { title: "Content Marketing Tips", date: "2024-02-18", wordCount: 1200 },
    { title: "Social Media Trends", date: "2024-02-15", wordCount: 1800 },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-accent mb-8">
          <ArrowLeft size={20} />
          Terug naar overzicht
        </Link>

        <div className="bg-card rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{clientName}</h1>
              <button className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
                <Edit size={20} />
                Dataset Bewerken
              </button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recente Artikelen</h2>
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-opacity-80 transition-all"
                >
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-gray-400">
                      Gepubliceerd op: {article.date}
                    </p>
                  </div>
                  <span className="text-sm text-accent">
                    {article.wordCount} woorden
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;