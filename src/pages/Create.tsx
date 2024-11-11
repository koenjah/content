import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const writingStyles = [
  { id: 'dataset', label: 'Vanuit de dataset (AANBEVOLEN)', recommended: true },
  { id: 'informal', label: 'Informeel' },
  { id: 'formal', label: 'Formeel' },
  { id: 'educational', label: 'Educatief' },
  { id: 'professional', label: 'Professioneel' },
];

const Create = () => {
  const [contentType, setContentType] = useState('keyword');
  const [customDataset, setCustomDataset] = useState('');

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-accent mb-8">
          <ArrowLeft size={20} />
          Terug naar Dashboard
        </Link>

        <div className="bg-card rounded p-6">
          <h1 className="text-2xl font-bold mb-6">Nieuw Artikel Maken</h1>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">Soort Artikel</label>
              <select className="input-field">
                <option>Blog Post</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Content Type</label>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded ${
                    contentType === 'keyword'
                      ? 'bg-accent text-white'
                      : 'bg-background'
                  }`}
                  onClick={() => setContentType('keyword')}
                >
                  Zoekterm
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    contentType === 'surfer'
                      ? 'bg-accent text-white'
                      : 'bg-background'
                  }`}
                  onClick={() => setContentType('surfer')}
                >
                  SurferSEO URL
                </button>
              </div>
            </div>

            {contentType === 'keyword' ? (
              <div>
                <label className="block mb-2">Zoekterm</label>
                <input type="text" className="input-field" placeholder="Voer zoekterm in" />
              </div>
            ) : (
              <div>
                <label className="block mb-2">SurferSEO URL</label>
                <input type="text" className="input-field" placeholder="Voer SurferSEO URL in" />
              </div>
            )}

            <div>
              <label className="block mb-2">Interne Links (Beta - Max 2 per artikel)</label>
              <input type="text" className="input-field" placeholder="Dit werkt nog niet zo goed, doe er max 2 per artikel" />
            </div>

            <div>
              <label className="block mb-2">Artikel Lengte</label>
              <input
                type="number"
                className="input-field"
                min="300"
                max="3000"
                placeholder="Aantal woorden (300-3000)"
              />
            </div>

            <div>
              <label className="block mb-2">Schrijfstijl</label>
              <select className="input-field">
                {writingStyles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Custom Dataset</label>
              <textarea
                className="input-field h-32"
                placeholder="Wil je een custom dataset gebruiken?"
                value={customDataset}
                onChange={(e) => setCustomDataset(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button className="btn-primary">
                Artikel Genereren
              </button>
              <button className="bg-background text-white px-4 py-2 rounded font-medium hover:bg-opacity-90 transition-all">
                Bulk Genereren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;