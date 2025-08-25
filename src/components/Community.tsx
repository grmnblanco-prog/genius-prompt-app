
import React from 'react';

const Community: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Comunidad</h2>
                    <p className="text-gray-500 dark:text-gray-400">Conéctate con otros creadores de prompts</p>
                </div>
            </div>

            <div className="text-center py-20">
                <i className="fas fa-cogs text-6xl text-gray-300 dark:text-gray-600 mb-6 animate-spin" style={{ animationDuration: '3s' }}></i>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">¡Estamos construyendo esto!</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-md mx-auto">
                    La sección de Comunidad está en desarrollo. Muy pronto podrás discutir ideas, colaborar en prompts y conectar con otros miembros. ¡Vuelve pronto!
                </p>
            </div>
        </div>
    );
};

export default Community;