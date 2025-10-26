import React from 'react';

interface PromptOutputProps {
  generatedPrompt: string;
  isLoading: boolean;
  loadingMessage: string;
  generationError: string | null;
  refinementFeedback: string;
  setRefinementFeedback: (value: string) => void;
  handleRefine: () => void;
  generationsRemaining: number;
}

const PromptOutput: React.FC<PromptOutputProps> = ({
  generatedPrompt,
  isLoading,
  loadingMessage,
  generationError,
  refinementFeedback,
  setRefinementFeedback,
  handleRefine,
  generationsRemaining,
}) => {
  return (
    <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">2. Revisa y Refina tu Prompt</h2>

      <div className="flex-grow flex flex-col bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-emerald-500 mb-4"></i>
            <p className="text-gray-600 dark:text-gray-300 font-medium">{loadingMessage}</p>
          </div>
        ) : generationError ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
            <p className="font-bold text-red-700 dark:text-red-300">No se pudo generar el prompt</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{generationError}</p>
          </div>
        ) : generatedPrompt ? (
          <>
            <textarea
              readOnly
              value={generatedPrompt}
              className="w-full flex-grow border rounded-md p-3 font-mono text-xs bg-white text-gray-800 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 resize-none"
            ></textarea>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic px-1">
              <b>Consejo:</b> Puedes refinar este prompt para un modelo de IA específico (como Gemini, ChatGPT, Claude) o ajustar su complejidad según tus necesidades.
            </p>
            <div className="relative mt-3">
              <input
                type="text"
                value={refinementFeedback}
                onChange={e => setRefinementFeedback(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 pr-24 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Refina el resultado (ej: 'hazlo más conciso')"
                disabled={generationsRemaining <= 0}
              />
              <button
                type="button"
                onClick={handleRefine}
                disabled={isLoading || !refinementFeedback.trim() || generationsRemaining <= 0}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500"
                title={generationsRemaining <= 0 ? 'Has agotado tus generaciones gratuitas' : ''}
              >
                Refinar
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <i className="far fa-lightbulb text-4xl mb-3"></i>
            <p className="font-semibold">El prompt generado aparecerá aquí</p>
            <p className="text-sm">Empieza por describir tu idea a la izquierda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptOutput;
