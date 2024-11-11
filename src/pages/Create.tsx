import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Create = () => {
  const [useSurferSEO, setUseSurferSEO] = useState(true);
  const [articleLength, setArticleLength] = useState('');
  const [customLength, setCustomLength] = useState('');

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-accent mb-8">
          <ArrowLeft size={20} />
          Terug naar overzicht
        </Link>

        <div className="bg-card rounded p-6">
          <h1 className="text-2xl font-bold mb-6">Nieuw artikel maken</h1>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">
                Selecteer een klant <span className="text-accent">*</span>
              </label>
              <select className="input-field">
                <option value="">Kies een klant</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">
                Met of zonder SurferSEO?
              </label>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded ${
                    useSurferSEO ? 'bg-accent text-white' : 'bg-background'
                  }`}
                  onClick={() => setUseSurferSEO(true)}
                >
                  Met SurferSEO
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    !useSurferSEO ? 'bg-accent text-white' : 'bg-background'
                  }`}
                  onClick={() => setUseSurferSEO(false)}
                >
                  Zonder SurferSEO
                </button>
              </div>
            </div>

            {useSurferSEO ? (
              <div>
                <label className="block mb-2">
                  SurferSEO URL <span className="text-accent">*</span>
                </label>
                <textarea 
                  className="input-field h-32" 
                  placeholder="Voer SurferSEO URL's in (één per regel)"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Let op: De outline moet al gegenereerd zijn in SurferSEO
                </p>
              </div>
            ) : (
              <div>
                <label className="block mb-2">
                  Zoekwoorden <span className="text-accent">*</span>
                </label>
                <textarea 
                  className="input-field h-32" 
                  placeholder="Voer zoekwoorden in (één per regel)"
                />
              </div>
            )}

            <div>
              <label className="block mb-2">
                Interne links Beta
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Dit werkt nog niet zo goed, doe er max 2 per artikel. (Liever helemaal niet gebruiken)" 
              />
            </div>

            <div>
              <label className="block mb-2">
                Artikel lengte <span className="text-accent">*</span>
              </label>
              {useSurferSEO ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="input-field"
                    value="Vanuit SurferSEO (AANBEVOLEN)"
                    readOnly
                  />
                  <div>
                    <label className="text-sm text-gray-400">Of vul een aangepaste lengte in:</label>
                    <input
                      type="number"
                      className="input-field mt-1"
                      min="300"
                      max="3000"
                      placeholder="Aantal woorden (300-3000)"
                      value={customLength}
                      onChange={(e) => setCustomLength(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  className="input-field"
                  min="300"
                  max="3000"
                  placeholder="Aantal woorden (300-3000)"
                  value={articleLength}
                  onChange={(e) => setArticleLength(e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="block mb-2">
                Je/u vorm <span className="text-accent">*</span>
              </label>
              <select className="input-field">
                <option value="je">Je vorm</option>
                <option value="u">U vorm</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">
                Doelgroep <span className="text-accent">*</span>
              </label>
              <select className="input-field">
                <option value="business">Bedrijven</option>
                <option value="consumer">Consumenten</option>
              </select>
            </div>

            <button className="btn-primary">
              Genereren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;