import React, { useState, useMemo } from 'react';
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


interface RepoPromptCardProps {
    prompt: Prompt;
}

const RepoPromptCard: React.FC<RepoPromptCardProps> = ({ prompt }) => {
    const { incrementDownloads, showNotification } = useAppContext();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (isCopied) return;
        navigator.clipboard.writeText(prompt.content).then(() => {
            setIsCopied(true);
            showNotification('¡Contenido copiado al portapapeles!');
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleDownload = () => {
        // Increment download count in context
        incrementDownloads(prompt.id);

        // Perform file download
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
                        <i className="far fa-star cursor-pointer hover:text-yellow-500"></i>
                        <i className="far fa-bookmark cursor-pointer hover:text-emerald-500"></i>
                    </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Por {prompt.author}
                    {prompt.rating !== undefined && ` • ${new Date(prompt.createdAt).toLocaleDateString()}`}
                </p>
                { prompt.rating !== undefined && prompt.downloads !== undefined ? (
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <div className="flex items-center">
                            <i className="fas fa-star text-yellow-500 dark:text-yellow-400 mr-1"></i>
                            <span>{prompt.rating}</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-download text-gray-500 dark:text-gray-400 mr-1.5"></i>
                            <span>{prompt.downloads} descargas</span>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 h-6 flex items-center">
                        Ejemplo de la Comunidad
                    </div>
                )}
                <details className="text-sm">
                    <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium">Ver Contenido</summary>
                    <div className="mt-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md border border-gray-200 dark:border-gray-600 max-h-24 overflow-y-auto">
                        <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{prompt.content}</pre>
                    </div>
                </details>
            </div>
            <div className="flex justify-between items-center text-xs mt-4">
                <span className={`px-2.5 py-1 rounded-full font-medium ${categoryColors[prompt.category]}`}>
                    {prompt.category}
                </span>
                <button 
                    onClick={handleDownload}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                    <i className="fas fa-download mr-2"></i>
                    Descargar
                </button>
            </div>
        </div>
    );
}


const Library: React.FC = () => {
    const { communityPrompts } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
    const [sortOrder, setSortOrder] = useState<string>('newest');
    const [activeTab, setActiveTab] = useState('explore');

    const filteredAndSortedPrompts = useMemo(() => {
        let prompts = [...communityPrompts];

        // Filter by search term
        if (searchTerm) {
            prompts = prompts.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.author?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter !== 'Todos') {
            prompts = prompts.filter(p => p.category === categoryFilter);
        }

        // Sort
        switch (sortOrder) {
            case 'rating':
                prompts.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.downloads || 0) - (a.downloads || 0));
                break;
            case 'downloads':
                prompts.sort((a, b) => (b.downloads || 0) - (a.downloads || 0) || (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
            default:
                prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return prompts;
    }, [communityPrompts, searchTerm, categoryFilter, sortOrder]);

    const recommendedPrompts = useMemo(() => {
        return [...communityPrompts]
            .filter(p => p.rating !== undefined && p.downloads !== undefined)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.downloads || 0) - (a.downloads || 0))
            .slice(0, 12);
    }, [communityPrompts]);

    const renderContent = () => {
        const promptsToRender = activeTab === 'explore' ? filteredAndSortedPrompts : recommendedPrompts;
        
        if (promptsToRender.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promptsToRender.map(prompt => (
                        <RepoPromptCard key={prompt.id} prompt={prompt} />
                    ))}
                </div>
            )
        }

        return (
             <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <i className="fas fa-search-minus text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No se encontraron prompts</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Intenta ajustar tus filtros o explora la pestaña de Recomendados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'explore'
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                        }`}
                    >
                        Explorar Todos
                    </button>
                     <button
                        onClick={() => setActiveTab('recommended')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'recommended'
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                        }`}
                    >
                        Recomendados
                    </button>
                </nav>
            </div>
            {activeTab === 'explore' && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <i className="fas fa-search text-gray-400"></i>
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="Buscar por título o autor..." 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                         <div className="md:col-span-1">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="Todos">Todas las Categorías</option>
                                {Object.values(Category).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                         <div className="md:col-span-1">
                             <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="newest">Ordenar por: Más Recientes</option>
                                <option value="rating">Ordenar por: Mejor Calificados</option>
                                <option value="downloads">Ordenar por: Más Populares</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
            
            {renderContent()}
        </div>
    );
};

export default Library;