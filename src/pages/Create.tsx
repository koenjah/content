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
          Terug naar dashboard
        </Link>

        <div className="bg-card rounded p-6">
          <h1 className="text-2xl font-bold mb-6">Nieuw artikel maken</h1>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">
                Soort artikel <span className="text-accent">*</span>
              </label>
              <select className="input-field">
                <option>Blog post</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">
                Content type <span className="text-accent">*</span>
              </label>
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
                  Surferseo url
                </button>
              </div>
            </div>

            {contentType === 'keyword' ? (
              <div>
                <label className="block mb-2">
                  Zoekterm <span className="text-accent">*</span>
                </label>
                <textarea 
                  className="input-field h-32" 
                  placeholder="Voer één zoekterm per regel in voor bulk generatie"
                />
              </div>
            ) : (
              <div>
                <label className="block mb-2">
                  Surferseo url <span className="text-accent">*</span>
                </label>
                <textarea 
                  className="input-field h-32" 
                  placeholder="Voer één SurferSEO URL per regel in voor bulk generatie. Let op: de outline moet al gegenereerd zijn in SurferSEO"
                />
              </div>
            )}

            <div>
              <label className="block mb-2">
                Interne links (Beta)
              </label>
              <input type="text" className="input-field" placeholder="Dit werkt nog niet zo goed, doe er max 2 per artikel" />
            </div>

            <div>
              <label className="block mb-2">
                Artikel lengte <span className="text-accent">*</span>
              </label>
              {contentType === 'surfer' ? (
                <input
                  type="text"
                  className="input-field"
                  defaultValue="Vanuit SurferSEO (AANBEVOLEN)"
                  placeholder="Aangepaste lengte (300-3000 woorden)"
                />
              ) : (
                <input
                  type="number"
                  className="input-field"
                  min="300"
                  max="3000"
                  placeholder="Aantal woorden (300-3000)"
                />
              )}
            </div>

            <div>
              <label className="block mb-2">
                Schrijfstijl <span className="text-accent">*</span>
              </label>
              <select className="input-field" defaultValue="dataset">
                {writingStyles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Custom dataset</label>
              <textarea
                className="input-field h-32"
                placeholder="Wil je een custom dataset gebruiken?"
                value={customDataset}
                onChange={(e) => setCustomDataset(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button className="btn-primary">
                Artikel genereren
              </button>
              <button className="bg-background text-white px-4 py-2 rounded font-medium hover:bg-opacity-90 transition-all">
                Bulk genereren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;