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
            const result = await api.generatePrompt(promptIdea, fileContent);
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
    }, [promptIdea, fileContent, showNotification, generationsRemaining, decrementGenerations]);
    
    const handleRefine = useCallback(async () => {
        if (!refinementFeedback || !generatedPrompt || generationsRemaining <= 0) return;
        setIsLoading(true);
        setGenerationError(null);
        
        try {
            const result = await api.refinePrompt(promptIdea, fileContent, generatedPrompt, refinementFeedback);
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


};

export default CreatePrompt;