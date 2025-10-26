import React from 'react';
import { Category } from '../types';

interface PromptSaveProps {
  title: string;
  setTitle: (value: string) => void;
  category: Category | '';
  setCategory: (value: Category | '') => void;
  validateAndSave: () => void;
  isLoading: boolean;
  generatedPrompt: string;
  errors: { [key: string]: string };
}

const PromptSave: React.FC<PromptSaveProps> = ({
  title,
  setTitle,
  category,
  setCategory,
  validateAndSave,
  isLoading,
  generatedPrompt,
  errors,
}) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">3. Guarda tu Prompt</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Prompt</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.title ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ej: Generador de posts para Instagram" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="" disabled>Selecciona una categoría</option>
            {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>
        <button type="button" onClick={validateAndSave} disabled={isLoading || !generatedPrompt.trim()} className={`w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed dark:hover:bg-emerald-500 dark:disabled:bg-gray-500 flex items-center justify-center`}>
          <i className="fas fa-save mr-2"></i>
          Guardar Prompt Generado
        </button>
      </div>
    </div>
  );
};

export default PromptSave;
