
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PanelIcon, CreateIcon, RepositoryIcon, CommunityIcon } from './icons';
import { useAppContext } from '../context/AppContext';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    count?: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, count }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <NavLink
            to={to}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                    : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ml-3">{label}</span>
            {count !== undefined && (
                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                    {count}
                </span>
            )}
        </NavLink>
    );
};

const LibraryIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);


const Sidebar: React.FC = () => {
    const { prompts, communityPrompts, generationsRemaining } = useAppContext();
    
    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-8 px-2">
                GeniusPrompt
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem to="/" icon={<PanelIcon className="w-5 h-5" />} label="Panel" />
                <NavItem to="/create" icon={<CreateIcon className="w-5 h-5" />} label="Crear Prompt" />
                <NavItem to="/repository" icon={<RepositoryIcon className="w-5 h-5" />} label="Mis Prompts" count={prompts.length} />
                <NavItem to="/library" icon={<LibraryIcon className="w-5 h-5" />} label="Biblioteca" count={communityPrompts.length} />
                <NavItem to="/community" icon={<CommunityIcon className="w-5 h-5" />} label="Comunidad" />
            </nav>

            <div className="mt-auto">
                <div className="px-4 py-3 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{generationsRemaining}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {generationsRemaining === 1 ? 'Generación restante' : 'Generaciones restantes'}
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;