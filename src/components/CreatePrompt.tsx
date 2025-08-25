import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Category } from '../types';
import { generateAdvancedPrompt, refineGeneratedPrompt } from '../services/geminiService';

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
    const { addPrompt, showNotification, generationsRemaining, decrementGenerations } = useAppContext();
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
            const result = await generateAdvancedPrompt(promptIdea, fileContent, decrementGenerations);
            setGeneratedPrompt(result);
        } catch (error) {
            const errorMessage = (error as Error).message;
            showNotification(errorMessage, 'error');
            setGenerationError(errorMessage);
            setGeneratedPrompt('');
        } finally {
            setIsLoading(false);
        }
    }, [promptIdea, fileContent, showNotification, generationsRemaining, decrementGenerations]);
    
    const handleRefine = useCallback(async () => {
        if (!refinementFeedback || !generatedPrompt || generationsRemaining <= 0) return;
        setIsLoading(true);
        setGenerationError(null);
        
        try {
            const result = await refineGeneratedPrompt(promptIdea, fileContent, generatedPrompt, refinementFeedback, decrementGenerations);
            setGeneratedPrompt(result);
            setRefinementFeedback('');
        } catch (error) {
             const errorMessage = (error as Error).message;
            showNotification(errorMessage, 'error');
            setGenerationError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [promptIdea, fileContent, generatedPrompt, refinementFeedback, showNotification, generationsRemaining, decrementGenerations]);

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
        <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Column - Input */}
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

                {/* Right Column - Output & Saving */}
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

                     <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                         <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">3. Guarda tu Prompt</h2>
                         <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Prompt</label>
                                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.title ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ej: Generador de posts para Instagram" />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                                <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="" disabled>Selecciona una categoría</option>
                                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>
                            <button type="button" onClick={validateAndSave} disabled={isLoading || !generatedPrompt.trim()} className={`w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed dark:hover:bg-emerald-500 dark:disabled:bg-gray-500 flex items-center justify-center`}>
                                <i className="fas fa-save mr-2"></i>
                                Guardar Prompt Generado
                            </button>
                         </div>
                     </div>
                </div>

            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md mx-4 transform transition-all duration-300 scale-100">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                            <i className="fas fa-check text-green-600 dark:text-green-400 text-xl"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">¡Guardado Exitosamente!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-6">
                            Tu prompt fue guardado exitosamente. Si quieres compartirlo elige la opción publicar en "Mis Prompts".
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => navigate('/repository')}
                                className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors flex-grow"
                            >
                                Ir a Mis Prompts
                            </button>
                            <button
                                onClick={() => { setShowSuccessModal(false); resetForm(); }}
                                className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors flex-grow"
                            >
                                Crear Otro Prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePrompt;