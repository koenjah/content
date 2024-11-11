import React from 'react';
import { Folder, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const clients = [
  "Veldkamp",
  "Lento Zorg",
  "Artena",
  "Unifloor",
  "Carbify",
  "Recruitment Now",
  "Optimaal Groeien"
];

const recentArticles = [
  {
    title: "SEO Optimalisatie voor Beginners",
    client: "Optimaal Groeien",
    date: "2024-02-20",
  },
  {
    title: "Duurzame Vloeren in 2024",
    client: "Unifloor",
    date: "2024-02-19",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Content Dashboard</h1>
          <Link to="/create" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nieuw Artikel
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Folder className="text-accent" />
                Klant Mappen
              </h2>
              <button className="text-accent hover:text-accent/80 transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clients.map((client) => (
                <Link
                  key={client}
                  to={`/client/${client.toLowerCase().replace(" ", "-")}`}
                  className="flex items-center gap-2 p-3 bg-background rounded card-hover"
                >
                  <Folder size={20} className="text-accent" />
                  <span>{client}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-card rounded p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-accent" />
              Recente Artikelen
            </h2>
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded card-hover"
                >
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-gray-400">{article.client}</p>
                  </div>
                  <span className="text-sm text-gray-400">{article.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;