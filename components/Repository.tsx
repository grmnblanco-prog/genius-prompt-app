
import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Prompt, Category } from '../types';

const categoryColors: { [key in Category]: string } = {
    [Category.Marketing]: 'bg-red-100 text-red-700',
    [Category.Educacion]: 'bg-yellow-100 text-yellow-700',
    [Category.SocialMedia]: 'bg-green-100 text-green-700',
    [Category.Escritura]: 'bg-blue-100 text-blue-700',
    [Category.Creatividad]: 'bg-purple-100 text-purple-700',
    [Category.AnalisisDeDatos]: 'bg-pink-100 text-pink-700',
    [Category.Codificacion]: 'bg-indigo-100 text-indigo-700',
    [Category.Investigacion]: 'bg-orange-100 text-orange-700',
    [Category.Negocios]: 'bg-teal-100 text-teal-700',
    [Category.Tecnologia]: 'bg-gray-100 text-gray-700',
    [Category.SaludYBienestar]: 'bg-lime-100 text-lime-700',
    [Category.Finanzas]: 'bg-cyan-100 text-cyan-700',
    [Category.Viajes]: 'bg-sky-100 text-sky-700',
    [Category.ArteYDiseno]: 'bg-rose-100 text-rose-700',
    [Category.Otras]: 'bg-stone-100 text-stone-700',
};

interface PersonalPromptCardProps {
    prompt: Prompt;
    onPublish: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    onCopy: () => void;
}

const PersonalPromptCard: React.FC<PersonalPromptCardProps> = ({ prompt, onPublish, onDelete, onToggleFavorite, onCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (isCopied) return;
        navigator.clipboard.writeText(prompt.content).then(() => {
            setIsCopied(true);
            onCopy();
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    const handleDownload = () => {
        const blob = new Blob([prompt.content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const filename = `${prompt.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-emerald-900/40 transition-shadow duration-300">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{prompt.title}</h3>
                    <div className="flex items-center space-x-3 text-gray-400 dark:text-gray-500">
                        {isCopied ? 
                            <i className="fas fa-check text-green-500" title="¡Copiado!"></i> : 
                            <i className="fas fa-copy cursor-pointer hover:text-emerald-500" title="Copiar Contenido" onClick={handleCopy}></i>
                        }
                        <i className="fas fa-download cursor-pointer hover:text-blue-500" title="Descargar" onClick={handleDownload}></i>
                        <i className={`fa-star ${prompt.isFavorite ? 'fas text-yellow-500' : 'far'} cursor-pointer hover:text-yellow-500`} title="Favorito" onClick={() => onToggleFavorite(prompt.id)}></i>
                        <i className="fas fa-edit cursor-pointer hover:text-blue-500" title="Editar"></i>
                        <i className="fas fa-trash-alt cursor-pointer hover:text-red-500" title="Eliminar" onClick={() => onDelete(prompt.id)}></i>
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{prompt.description}</p>
                <details className="text-sm">
                    <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium">Ver Contenido</summary>
                    <div className="mt-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md border border-gray-200 dark:border-gray-600 max-h-24 overflow-y-auto">
                        <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{prompt.content}</pre>
                    </div>
                </details>
            </div>
            <div className="flex justify-between items-center text-xs mt-4">
                <span className={`px-2.5 py-1 rounded-full font-medium ${categoryColors[prompt.category] || 'bg-gray-200 text-gray-800'}`}>
                    {prompt.category}
                </span>
                 <button 
                    onClick={() => onPublish(prompt.id)}
                    disabled={prompt.isPublished}
                    className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center dark:hover:bg-blue-400 dark:disabled:bg-gray-500">
                    <i className={`mr-2 ${prompt.isPublished ? 'fas fa-check' : 'fas fa-globe-americas'}`}></i>
                    {prompt.isPublished ? 'Publicado' : 'Publicar'}
                </button>
            </div>
        </div>
    );
};

const Repository: React.FC = () => {
    const { prompts, publishPrompt, deletePrompt, toggleFavorite, showNotification, importPrompts } = useAppContext();
    const [filter, setFilter] = useState<'all' | 'favorites'>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredPrompts = useMemo(() => {
        if (filter === 'favorites') {
            return prompts.filter(p => p.isFavorite);
        }
        return prompts;
    }, [prompts, filter]);
    
    const handleExport = () => {
        if (prompts.length === 0) {
            showNotification('No tienes prompts para exportar.', 'error');
            return;
        }

        const dataToExport = JSON.stringify(prompts, null, 2);
        const blob = new Blob([dataToExport], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'intelliprompt_export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotification('¡Todos los prompts exportados con éxito!');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content === 'string') {
                importPrompts(content);
            } else {
                showNotification('No se pudo leer el archivo.', 'error');
            }
        };
        reader.onerror = () => {
            showNotification('Error al leer el archivo.', 'error');
        };
        reader.readAsText(file);
        
        // Reset file input to allow importing the same file again
        event.target.value = '';
    };


    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
                    <div className="border-b-2 border-transparent">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button
                                onClick={() => setFilter('all')}
                                className={`whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors ${
                                    filter === 'all'
                                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                                }`}
                            >
                                Todos
                            </button>
                             <button
                                onClick={() => setFilter('favorites')}
                                className={`whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors ${
                                    filter === 'favorites'
                                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                                }`}
                            >
                                Favoritos
                            </button>
                        </nav>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                        <button
                            onClick={handleImportClick}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap"
                            title="Importar prompts desde un archivo JSON"
                        >
                            <i className="fas fa-file-import"></i>
                            Importar
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap"
                            title="Exportar todos tus prompts a un archivo JSON"
                        >
                            <i className="fas fa-file-export"></i>
                            Exportar
                        </button>
                    </div>
                </div>
                <div className="relative w-full md:w-1/3">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <i className="fas fa-search text-gray-400"></i>
                    </span>
                    <input type="text" placeholder="Buscar en mis prompts..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                </div>
            </div>
            {filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrompts.map(prompt => (
                        <PersonalPromptCard 
                            key={prompt.id} 
                            prompt={prompt} 
                            onPublish={publishPrompt}
                            onDelete={deletePrompt}
                            onToggleFavorite={toggleFavorite}
                            onCopy={() => showNotification('¡Contenido copiado al portapapeles!')}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <i className="fas fa-folder-open text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{filter === 'favorites' ? 'No tienes prompts favoritos' : 'No tienes prompts guardados'}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{filter === 'favorites' ? 'Haz clic en la estrella para añadir uno.' : '¡Empieza por crear tu primer prompt con nuestro asistente de IA!'}</p>
                </div>
            )}
        </div>
    );
};

export default Repository;