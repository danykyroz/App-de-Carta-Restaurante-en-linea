import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
      <label htmlFor="lang" className="sr-only">Language</label>
      <select
        id="lang"
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="bg-gray-900 text-gray-200 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none"
        aria-label="Select language"
      >
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
