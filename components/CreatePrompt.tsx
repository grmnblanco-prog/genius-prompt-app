import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Category } from '../types';
import api from '../services/api';



const starterTemplates: { name: string; category: Category; icon: string; content: string }[] = [
    { name: "Redes Sociales", category: Category.SocialMedia, icon: "fa-share-alt", content: "Crear una serie de 3 posts para Instagram sobre [tema], dirigidos a [audiencia]. El tono debe ser [tono, ej: divertido, inspirador]." },
    { name: "Blog", category: Category.Escritura, icon: "fa-blog", content: "Escribir un borrador de artículo de blog de 500 palabras sobre [tema principal]. Incluir una introducción, 3 puntos clave y una conclusión. La palabra clave SEO es '[palabra clave]'." },
    { name: "Código", category: Category.Codificacion, icon: "fa-code", content: "Generar una función en [lenguaje, ej: JavaScript] que [propósito de la función, ej: 'convierta un objeto a un array de sus valores']. Debe incluir comentarios explicando la lógica." },
    { name: "Slogans", category: Category.Marketing, icon: "fa-lightbulb", content: "Generar 5 eslóganes creativos para una marca de [tipo de producto] llamada [nombre de la marca]." },
    { name: "Análisis FODA", category: Category.Negocios, icon: "fa-chart-pie", content: "Realizar un análisis FODA (Fortalezas, Oportunidades, Debilidades, Amenazas) para una empresa que [describe la empresa]." },
    { name: "Historia Corta", category: Category.Creatividad, icon: "fa-book", content: "Proponer 3 ideas para una historia corta de [género, ej: ciencia ficción] que involucre a [un tipo de personaje] y [un objeto misterioso]." },
    { name: "Plan de Lección", category: Category.Educacion, icon: "fa-chalkboard-teacher", content: "Crear un plan de lección de 60 minutos sobre [tema] para estudiantes de [nivel educativo]. Incluir objetivos de aprendizaje, actividades y una forma de evaluación." },
    { name: "Consulta SQL", category: Category.AnalisisDeDatos, icon: "fa-database", content: "Escribir una consulta SQL para [base de datos, ej: PostgreSQL] que seleccione [columnas] de la tabla [nombre_tabla] donde [condición]." },
    { name: "Resumen de Artículo", category: Category.Investigacion, icon: "fa-flask", content: "Resumir los puntos clave, la metodología y las conclusiones del siguiente texto de investigación: [pegar texto o abstract aquí]." },
    { name: "Explicación Técnica", category: Category.Tecnologia, icon: "fa-microchip", content: "Explicar el concepto de [concepto tecnológico, ej: 'Computación Sin Servidor'] a una audiencia [tipo de audiencia, ej: no técnica], usando analogías simples." },
    { name: "Plan de Comidas", category: Category.SaludYBienestar, icon: "fa-heartbeat", content: "Crear un plan de comidas saludable para 3 días para una persona que busca [objetivo, ej: perder peso], con opciones para desayuno, almuerzo y cena." },
    { name: "Email Financiero", category: Category.Finanzas, icon: "fa-file-invoice-dollar", content: "Redactar un email a un cliente explicando las ventajas de [producto financiero, ej: un fondo de inversión indexado]. El tono debe ser claro y confiable." },
    { name: "Itinerario de Viaje", category: Category.Viajes, icon: "fa-plane-departure", content: "Crear un itinerario de [número de días] días para un viaje a [destino], enfocado en [intereses, ej: cultura, aventura, gastronomía]." },
    { name: "Brief de Diseño", category: Category.ArteYDiseno, icon: "fa-palette", content: "Elaborar un brief de diseño para un logotipo para una marca de [tipo de producto] llamada [nombre]. La marca debe transmitir [valores, ej: elegancia, modernidad]." },
    { name: "Ideas Generales", category: Category.Otras, icon: "fa-random", content: "Generar una lista de 5 ideas sobre [tema]." }
].sort((a, b) => a.name.localeCompare(b.name));

const loadingMessages = [
    "Analizando tu idea inicial...",
    "Contactando a los modelos de IA...",
    "Construyendo la estructura del prompt...",
    "Aplicando técnicas de ingeniería de prompts...",
    "Esto puede tardar unos segundos...",
    "Casi listo..."
];


const CreatePrompt: React.FC = () => {
    const { addPrompt, showNotification, generationsRemaining, decrementGenerations, generatePrompt, refinePrompt } = useAppContext();
    const navigate = useNavigate();
    
    // State for generated content and saving
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category | ''>('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    
    // State for user input
    const [promptIdea, setPromptIdea] = useState('');
    const [refinementFeedback, setRefinementFeedback] = useState('');
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const promptIdeaRef = useRef<HTMLTextAreaElement>(null);

    // General state
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [newlyCreatedPromptId, setNewlyCreatedPromptId] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    useEffect(() => {
        if (promptIdea || fileContent) {
            setGenerationError(null);
        }
    }, [promptIdea, fileContent]);

    useEffect(() => {
        let interval: number | undefined;
        if (isLoading) {
            setLoadingMessage(loadingMessages[0]);
            let i = 1;
            interval = window.setInterval(() => {
                setLoadingMessage(loadingMessages[i % loadingMessages.length]);
                i++;
            }, 3000);
        } else {
            setLoadingMessage('');
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isLoading]);


    const resetForm = () => {
        setTitle('');
        setCategory('');
        setPromptIdea('');
        setGeneratedPrompt('');
        setRefinementFeedback('');
        setErrors({});
        setNewlyCreatedPromptId(null);
        setGenerationError(null);
        setFileContent(null);
        setFileName(null);
    };
    
    const handleTemplateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTemplateName = e.target.value;
        if (selectedTemplateName) {
            const template = starterTemplates.find(t => t.name === selectedTemplateName);
            if (template) {
                setPromptIdea(template.content);
                setCategory(template.category);
                promptIdeaRef.current?.focus();
            }
            e.target.value = '';
        }
    };

    const handlePromptIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPromptIdea(e.target.value);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setFileContent(text);
                showNotification('Archivo cargado como contexto.', 'success');
            };
            reader.onerror = () => {
                showNotification('Error al leer el archivo.', 'error');
                setFileContent(null);
                setFileName(null);
            };
            reader.readAsText(file);
        }
        event.target.value = '';
    };

    const removeFile = () => {
        setFileContent(null);
        setFileName(null);
    };

    const handleGenerate = useCallback(async () => {
        if ((!promptIdea && !fileContent) || generationsRemaining <= 0) return;
        setIsLoading(true);
        setGeneratedPrompt('');
        setGenerationError(null);

        try {
            const result = await generatePrompt(promptIdea, fileContent);
            setGeneratedPrompt(result);
            decrementGenerations();
        } catch (error) {
            const errorMessage = (error as Error).message;
            showNotification(errorMessage, 'error');
            setGenerationError(errorMessage);
            setGeneratedPrompt('');
        } finally {
            setIsLoading(false);
        }
    }, [promptIdea, fileContent, showNotification, generationsRemaining, decrementGenerations, generatePrompt]);
    
    const handleRefine = useCallback(async () => {
        if (!refinementFeedback || !generatedPrompt || generationsRemaining <= 0) return;
        setIsLoading(true);
        setGenerationError(null);
        
        try {
            const result = await refinePrompt(promptIdea, fileContent, generatedPrompt, refinementFeedback);
            setGeneratedPrompt(result);
            decrementGenerations();
            setRefinementFeedback('');
        } catch (error) {
             const errorMessage = (error as Error).message;
            showNotification(errorMessage, 'error');
            setGenerationError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [promptIdea, fileContent, generatedPrompt, refinementFeedback, showNotification, generationsRemaining, decrementGenerations, refinePrompt]);

    const validateAndSave = () => {
        const newErrors: { [key: string]: string } = {};
        if (!title.trim()) newErrors.title = 'El nombre del prompt es requerido.';
        if (!category) newErrors.category = 'Debes seleccionar una categoría.';
        if (!generatedPrompt.trim()) {
            newErrors.generatedPrompt = 'Debes generar un prompt válido primero.';
            showNotification('Por favor, genera un prompt válido antes de guardar.', 'error');
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            const descriptionToSave = `Prompt generado por IA a partir de la idea: "${promptIdea}". ${fileName ? `Contexto del archivo: ${fileName}` : ''}`.trim();
            const newId = addPrompt({ title, category: category as Category, description: descriptionToSave, content: generatedPrompt });
            setNewlyCreatedPromptId(newId);
            setShowSuccessModal(true);
        }
    };

    const isGenerationDisabled = isLoading || (!promptIdea.trim() && !fileContent) || generationsRemaining <= 0;

    return (
        <div className="container mx-auto p-4 flex flex-col h-full overflow-hidden">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Crear Nuevo Prompt</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Utiliza el asistente de IA para transformar tus ideas en prompts de alta calidad o empieza desde cero.</p>

            <div className="flex-grow flex gap-6 overflow-hidden">
                {/* Columna Izquierda: Asistente y Editor */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 overflow-y-auto">
                        <div className="mb-6">
                            <label htmlFor="promptIdea" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">1. Describe tu idea o necesidad</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sé claro y conciso. La IA usará esto como punto de partida.</p>
                            <div className="relative">
                                <textarea
                                    id="promptIdea"
                                    ref={promptIdeaRef}
                                    value={promptIdea}
                                    onChange={handlePromptIdeaChange}
                                    placeholder="Ej: 'Necesito una estrategia de marketing para una nueva marca de café sostenible...'"
                                    className={`w-full p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 transition-shadow duration-300 ${generationError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`}
                                    rows={5}
                                />
                                <div className="absolute bottom-3 right-3">
                                    <select onChange={handleTemplateSelection} className="text-sm bg-gray-200 dark:bg-gray-600 rounded-md p-1 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                        <option value="">... o usa una plantilla</option>
                                        {starterTemplates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            {generationError && <p className="text-red-500 text-sm mt-2">{generationError}</p>}
                        </div>

                        <div className="mb-6">
                             <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">2. Añade contexto (Opcional)</label>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sube un archivo (.txt, .md, .csv) para dar más detalles a la IA.</p>
                             {fileName ? (
                                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-file-alt text-gray-500 dark:text-gray-300"></i>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{fileName}</span>
                                    </div>
                                    <button onClick={removeFile} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                                        <i className="fas fa-times-circle"></i>
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="file-upload" className="w-full flex items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                    <div className="text-center">
                                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 dark:text-gray-500 mb-2"></i>
                                        <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Haz clic para subir</span> o arrastra y suelta</p>
                                    </div>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,.csv,.json,.html,.css,.js,.py" />
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerationDisabled}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                            >
                                <i className="fas fa-magic"></i>
                                <span>Generar Prompt</span>
                                <span className="text-xs opacity-80">({generationsRemaining} restantes)</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Resultado y Guardado */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 flex-grow flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">3. Resultado Generado</h2>
                        <div className="flex-grow mb-4 relative">
                            {isLoading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg z-10">
                                    <i className="fas fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">{loadingMessage}</p>
                                </div>
                            ) : (
                                <textarea
                                    value={generatedPrompt}
                                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                                    placeholder="Aquí aparecerá el prompt generado por la IA..."
                                    className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white resize-none"
                                />
                            )}
                        </div>

                        {generatedPrompt && !isLoading && (
                             <div className="mb-4">
                                <label htmlFor="refinement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Refinar el prompt (opcional)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="refinement"
                                        value={refinementFeedback}
                                        onChange={(e) => setRefinementFeedback(e.target.value)}
                                        placeholder="Ej: 'Hazlo más formal', 'Añade un ejemplo para un e-commerce'"
                                        className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                    <button
                                        onClick={handleRefine}
                                        disabled={!refinementFeedback || generationsRemaining <= 0}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50"
                                    >
                                       <i className="fas fa-sync-alt"></i> Refinar
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">4. Guardar el Prompt</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="promptName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        id="promptName"
                                        value={title}
                                        onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({...errors, title: ''}); }}
                                        placeholder="Ej: 'Estrategia de Email para Lanzamiento'"
                                        className={`w-full p-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => { setCategory(e.target.value as Category); if (errors.category) setErrors({...errors, category: ''}); }}
                                        className={`w-full p-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    >
                                        <option value="" disabled>Selecciona una categoría</option>
                                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>
                            </div>
                            <button
                                onClick={validateAndSave}
                                disabled={!generatedPrompt.trim()}
                                className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                            >
                                <i className="fas fa-save"></i> Guardar en mi Biblioteca
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-md">
                        <div className="text-green-500 mb-4">
                            <i className="fas fa-check-circle fa-4x"></i>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">¡Prompt Guardado!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Tu nuevo prompt ha sido guardado exitosamente en tu biblioteca personal.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => navigate(`/library?highlight=${newlyCreatedPromptId}`)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                Ver en Biblioteca
                            </button>
                             <button onClick={() => { setShowSuccessModal(false); resetForm(); }} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                                Crear Otro Prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePrompt;