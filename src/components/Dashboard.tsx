
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Prompt, Category } from '../types';

const categoryColors: { [key in Category]: string } = {
    [Category.Marketing]: 'bg-red-100 text-red-700 border-red-200',
    [Category.Educacion]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [Category.SocialMedia]: 'bg-green-100 text-green-700 border-green-200',
    [Category.Escritura]: 'bg-blue-100 text-blue-700 border-blue-200',
    [Category.Creatividad]: 'bg-purple-100 text-purple-700 border-purple-200',
    [Category.AnalisisDeDatos]: 'bg-pink-100 text-pink-700 border-pink-200',
    [Category.Codificacion]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [Category.Investigacion]: 'bg-orange-100 text-orange-700 border-orange-200',
    [Category.Negocios]: 'bg-teal-100 text-teal-700 border-teal-200',
    [Category.Tecnologia]: 'bg-gray-200 text-gray-800 border-gray-300',
    [Category.SaludYBienestar]: 'bg-lime-100 text-lime-700 border-lime-200',
    [Category.Finanzas]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    [Category.Viajes]: 'bg-sky-100 text-sky-700 border-sky-200',
    [Category.ArteYDiseno]: 'bg-rose-100 text-rose-700 border-rose-200',
    [Category.Otras]: 'bg-stone-100 text-stone-700 border-stone-200',
};


const CategoryStatChart: React.FC<{ title: string; data: { [key: string]: number } }> = ({ title, data }) => {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    const hasData = total > 0;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
            {hasData ? (
                <div className="space-y-3">
                    {Object.entries(data).map(([category, count]) => {
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        return (
                            <div key={category}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">{category}</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`${(categoryColors[category as Category] || 'bg-gray-200').split(' ')[0]} h-2 rounded-full`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <i className="fas fa-chart-pie text-4xl text-gray-300 dark:text-gray-600"></i>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No hay datos para mostrar.</p>
                </div>
            )}
        </div>
    );
};

const FavoritePromptCard: React.FC<{ prompt: Prompt }> = ({ prompt }) => (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="flex-grow">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[prompt.category] || 'bg-gray-200 text-gray-800'}`}>{prompt.category}</span>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 my-2 truncate" title={prompt.title}>{prompt.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 h-8 overflow-hidden text-ellipsis">{prompt.description}</p>
        </div>
        <Link to="/repository" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors self-start mt-2">
            Ver en Repositorio <i className="fas fa-arrow-right ml-1"></i>
        </Link>
    </div>
);


const QuickStartGuide = () => (
    <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Guía de Inicio Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start">
                <i className="fas fa-pencil-alt text-2xl text-emerald-500 mr-4 mt-1"></i>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">1. Crea</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ve a 'Crear Prompt' para empezar. Describe tu idea en lenguaje natural.</p>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start">
                <i className="fas fa-magic text-2xl text-blue-500 mr-4 mt-1"></i>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">2. Genera</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Usa el asistente de IA para transformar tu idea en un prompt profesional y estructurado.</p>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start">
                <i className="fas fa-save text-2xl text-purple-500 mr-4 mt-1"></i>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">3. Guarda</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Guarda el prompt generado en 'Mis Prompts' para usarlo cuando quieras.</p>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start">
                <i className="fas fa-book-open text-2xl text-orange-500 mr-4 mt-1"></i>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">4. Explora</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Descubre y descarga prompts de otros creadores en la 'Biblioteca'.</p>
                </div>
            </div>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const { prompts } = useAppContext();

    const promptsByCategory = prompts.reduce((acc, prompt) => {
        acc[prompt.category] = (acc[prompt.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const favoritePrompts = prompts
        .filter(p => p.isFavorite)
        .slice(0, 4);

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold">¡Bienvenido a GeniusPrompt!</h2>
                <p className="mt-1 opacity-90">Estás listo para crear prompts de IA de alta calidad. Empieza con la guía rápida o salta directamente a la acción.</p>
            </div>

            <QuickStartGuide />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CategoryStatChart title="Mis Prompts por Categoría" data={promptsByCategory} />
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-full">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Mis Prompts Favoritos</h3>
                        {favoritePrompts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {favoritePrompts.map(p => <FavoritePromptCard key={p.id} prompt={p} />)}
                            </div>
                        ) : (
                             <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                                <i className="far fa-star text-4xl text-gray-300 dark:text-gray-600"></i>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Marca tus prompts con una estrella para verlos aquí.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
             <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <Link to="/create" className="text-center bg-emerald-600 text-white p-6 rounded-xl hover:bg-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/30">
                        <i className="fas fa-plus-circle text-4xl mb-3"></i>
                        <h4 className="font-bold">Crear Nuevo Prompt</h4>
                    </Link>
                     <Link to="/repository" className="text-center bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30">
                        <i className="fas fa-folder-open text-4xl mb-3"></i>
                        <h4 className="font-bold">Ver Mis Prompts</h4>
                    </Link>
                    <Link to="/library" className="text-center bg-indigo-600 text-white p-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/30">
                        <i className="fas fa-book-open text-4xl mb-3"></i>
                        <h4 className="font-bold">Explorar Biblioteca</h4>
                    </Link>
                    <Link to="/community" className="text-center bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30">
                        <i className="fas fa-users text-4xl mb-3"></i>
                        <h4 className="font-bold">Ir a la Comunidad</h4>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;