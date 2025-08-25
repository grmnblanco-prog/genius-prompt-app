
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const getPageTitle = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Panel de Prompts';
        case '/create':
            return 'Crear Prompt con AI';
        case '/repository':
            return 'Mis Prompts Personales';
        case '/library':
            return 'Biblioteca de la Comunidad';
        case '/community':
            return 'Comunidad';
        default:
            return 'Panel de Prompts';
    }
};

const Header: React.FC = () => {
    const location = useLocation();
    const title = getPageTitle(location.pathname);
    const { theme, toggleTheme } = useAppContext();

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 py-3 gap-4">
            <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h1>
            </div>
            <div className="flex items-center justify-end flex-grow space-x-4">
                 <button 
                    onClick={toggleTheme} 
                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2.5 transition-colors duration-200"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <i className="fas fa-moon text-lg"></i> : <i className="fas fa-sun text-lg"></i>}
                </button>
                <Link
                    to="/create"
                    className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Crear
                </Link>
            </div>
        </header>
    );
};

export default Header;