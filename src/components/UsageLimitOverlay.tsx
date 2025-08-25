import React from 'react';

const UsageLimitOverlay: React.FC = () => {
    const feedbackEmail = 'grmnblanco@gmail.com';
    const waitlistSubject = "GeniusPrompt - Unirme a la lista de espera";
    const waitlistBody = "¡Hola! Me gustaría unirme a la lista de espera para la versión completa de GeniusPrompt y ser notificado cuando esté disponible.";
    
    const feedbackSubject = "GeniusPrompt - Feedback sobre el MVP";
    const feedbackBody = `
Hola, he probado GeniusPrompt y esta es mi opinión:

(Por favor, selecciona una o más opciones y añade cualquier comentario adicional)

[ ] El concepto no es lo que esperaba.
[ ] La calidad de los prompts generados no fue suficientemente buena.
[ ] La interfaz de usuario es confusa o difícil de usar.
[ ] Encontré errores o problemas técnicos.
[ ] El límite de generaciones gratuitas es muy bajo.
[ ] No estoy seguro/a de querer pagar por una herramienta como esta.

Comentarios adicionales:
[Escribe tus comentarios aquí]
`;

    const waitlistMailto = `mailto:${feedbackEmail}?subject=${encodeURIComponent(waitlistSubject)}&body=${encodeURIComponent(waitlistBody)}`;
    const feedbackMailto = `mailto:${feedbackEmail}?subject=${encodeURIComponent(feedbackSubject)}&body=${encodeURIComponent(feedbackBody)}`;

    return (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-lg mx-auto transform transition-all duration-300 scale-100 border border-emerald-500/30">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-5 border-4 border-white dark:border-gray-800 shadow-lg">
                    <i className="fas fa-paper-plane text-emerald-600 dark:text-emerald-400 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">¡Gracias por probar GeniusPrompt!</h3>
                <p className="text-md text-gray-600 dark:text-gray-300 mt-3 mb-6">
                    Has agotado tus generaciones gratuitas. Estamos preparando una versión completa con almacenamiento en la nube, historial ilimitado y funciones avanzadas.
                </p>
                <div className="flex flex-col gap-4">
                    <a
                        href={waitlistMailto}
                        className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-transform transform hover:scale-105"
                    >
                        <i className="fas fa-user-plus mr-2"></i>
                        Únete a la Lista de Espera
                    </a>
                    <a
                        href={feedbackMailto}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline"
                    >
                        ¿No te interesa? Danos tu opinión
                    </a>
                </div>
                 <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
                    Tu feedback es muy valioso y nos ayuda a construir un mejor producto.
                </p>
            </div>
        </div>
    );
};

export default UsageLimitOverlay;