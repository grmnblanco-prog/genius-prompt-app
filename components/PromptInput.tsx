import React from 'react';
import { Category } from '../types';

interface PromptInputProps {
  promptIdea: string;
  setPromptIdea: (value: string) => void;
  fileContent: string | null;
  setFileContent: (value: string | null) => void;
  fileName: string | null;
  setFileName: (value: string | null) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  generationsRemaining: number;
  starterTemplates: { name: string; category: Category; icon: string; content: string }[];
  handleTemplateSelection: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: () => void;
  promptIdeaRef: React.RefObject<HTMLTextAreaElement>;
  handlePromptIdeaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  promptIdea,
  setPromptIdea,
  fileName,
  handleGenerate,
  isLoading,
  generationsRemaining,
  starterTemplates,
  handleTemplateSelection,
  handleFileChange,
  removeFile,
  promptIdeaRef,
  handlePromptIdeaChange,
}) => {
  const isGenerationDisabled = isLoading || (!promptIdea.trim() && !fileContent) || generationsRemaining <= 0;

  return (
    <div className="lg:col-span-2">
      <div className="bg-emerald-600 text-white p-4 rounded-t-xl">
        <h3 className="font-bold flex items-center"><i className="fas fa-magic mr-2"></i>Asistente de Creación con IA</h3>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="promptIdea" className="block text-sm font-bold text-gray-700 dark:text-gray-300">1. Describe tu idea inicial</label>
            {promptIdea && (
              <button onClick={() => setPromptIdea('')} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">Limpiar</button>
            )}
          </div>
          <textarea id="promptIdea" ref={promptIdeaRef} value={promptIdea} onChange={handlePromptIdeaChange} rows={4} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 font-mono text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Ej: 'un prompt para crear descripciones de productos de café'"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Añadir contexto desde un archivo (Opcional)
          </label>
          {fileName ? (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <div className="flex items-center overflow-hidden">
                <i className="fas fa-file-alt text-gray-500 dark:text-gray-400 mr-2"></i>
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{fileName}</span>
              </div>
              <button onClick={removeFile} className="text-red-500 hover:text-red-700 text-sm font-semibold ml-2 flex-shrink-0">Quitar</button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer text-emerald-600 dark:text-emerald-400 font-semibold">
                <i className="fas fa-upload mr-2"></i>
                Seleccionar un archivo
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sube un archivo de texto (.txt) para dar contexto.</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="template-select" className="block text-sm text-center text-gray-500 dark:text-gray-400 mb-2">
            Opcional: Empieza con una plantilla rápida
          </label>
          <select
            id="template-select"
            onChange={handleTemplateSelection}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled>Selecciona una plantilla...</option>
            {starterTemplates.map(template => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerationDisabled}
            className="w-full text-lg font-bold py-3 rounded-lg transition-colors bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed flex items-center justify-center dark:hover:bg-emerald-500 dark:disabled:bg-gray-500"
            title={generationsRemaining <= 0 ? 'Has agotado tus generaciones gratuitas' : ''}
          >
            {isLoading ? <><i className="fas fa-spinner fa-spin mr-3"></i>Generando...</> : <><i className="fas fa-lightbulb mr-3"></i>Generar Prompt</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
