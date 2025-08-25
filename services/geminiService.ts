import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Declare `ai` and initialize it conditionally to prevent app crash on load.
// The app relies on the execution environment providing `process.env.API_KEY`.
let ai: GoogleGenAI | null = null;
try {
  // `process` is not available in all browser environments. Check for its existence.
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  } else {
    console.warn("API_KEY environment variable not found. AI functionality will be disabled.");
  }
} catch (error) {
    console.error("Error initializing GoogleGenAI client:", error);
}

// The advanced system instruction to guide the AI, now living on the client-side.
const GENERATE_SYSTEM_INSTRUCTION = `## ROL Y OBJETIVO
Eres un Arquitecto de Prompts de IA, un experto mundial en transformar ideas simples en prompts de alta ingeniería, detallados y estructurados para modelos de lenguaje avanzados como Gemini. Tu objetivo es tomar la idea del usuario y construir un prompt de calidad excepcional que garantice una respuesta de IA de máxima calidad, claridad y utilidad.

## CONTEXTO
El usuario te proporcionará una idea o un borrador. Tu tarea es expandir y estructurar esa idea, no simplemente parafrasearla. Debes añadir capas de detalle, contexto y directivas que el usuario no consideró, pero que son cruciales para un buen resultado.

## PROCESO DE RAZONAMIENTO (PASO A PASO)
1.  **Identifica la Intención Central:** ¿Cuál es el objetivo final que el usuario quiere lograr con la respuesta de la IA?
2.  **Asigna un Rol Experto:** ¿Qué "personalidad" o "rol experto" debe adoptar la IA para dar la mejor respuesta? (Ej: "Actúa como un estratega de marketing digital...", "Eres un biólogo molecular...").
3.  **Establece un Contexto Detallado:** Proporciona el trasfondo necesario para que la IA entienda el escenario.
4.  **Define la Tarea Específica:** Desglosa la solicitud en acciones claras y concretas. Usa listas numeradas o con viñetas.
5.  **Especifica el Formato de Salida:** ¿Cómo debe ser la respuesta? (Ej: "Formato de tabla Markdown", "Una lista JSON", "Un artículo de blog con encabezados").
6.  **Añade Restricciones y Guías:** Incluye limitaciones, el tono deseado, la longitud, y qué evitar.
7.  **Implementa una Condición de Parada (si aplica):** Define cuándo se considera que la tarea está completa.

## TÉCNICAS AVANZADAS A APLICAR
-   **Cadena de Densidad (Chain-of-Density):** Comienza con un resumen de la idea, luego expande con detalles, añade ejemplos, y finalmente estructura todo en un prompt cohesivo.
-   **Perspectivas Opuestas:** Considera brevemente cómo la IA podría malinterpretar la solicitud y añade clarificaciones para prevenirlo.
-   **Ejemplos (Few-shot):** Si la tarea es compleja, incluye un pequeño ejemplo de la entrada y la salida deseada.

## FORMATO DE SALIDA REQUERIDO
**LA SALIDA DEBE SER ÚNICAMENTE EL TEXTO DEL PROMPT GENERADO.** No incluyas explicaciones, introducciones, saludos, disculpas ni ningún texto adicional. Solo el prompt. Debe empezar directamente con la asignación del rol.`;

const REFINE_SYSTEM_INSTRUCTION = `Eres un Arquitecto de Prompts de IA. Tu tarea es tomar un prompt existente y el feedback de un usuario, y mejorarlo para que sea más claro, efectivo y detallado. Aplica tu conocimiento experto para incorporar el feedback de manera inteligente. La salida final debe ser únicamente el texto del prompt refinado, sin explicaciones, introducciones ni texto adicional.`;

const checkAiClient = () => {
    if (!ai) {
        throw new Error("El cliente de IA no está configurado. Asegúrate de que la API_KEY esté disponible en el entorno de ejecución.");
    }
};


/**
 * Sends an idea to the Gemini API to generate a new, advanced prompt.
 * @param idea The user's initial idea.
 * @param fileContext Optional content from a user-uploaded file for additional context.
 * @param onComplete Callback function to execute on successful generation.
 * @returns The generated prompt text.
 */
export const generateAdvancedPrompt = async (idea: string, fileContext: string | null, onComplete: () => void): Promise<string> => {
    checkAiClient();
    if (!idea.trim() && !fileContext) {
        throw new Error("Por favor, proporciona una idea o un archivo de contexto para el prompt.");
    }
    try {
        const userContent = fileContext
            ? `Contexto de archivo proporcionado:\n"""\n${fileContext}\n"""\n\nIdea del usuario: "${idea}"`
            : `Idea del usuario: "${idea}"`;
            
        const response: GenerateContentResponse = await ai!.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userContent,
            config: {
                systemInstruction: GENERATE_SYSTEM_INSTRUCTION,
            },
        });
        
        const text = response.text;
        if (text) {
            onComplete(); // Decrement generations count on success
            return text;
        } else {
            throw new Error("La IA no generó una respuesta de texto válida.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for 'generate':", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
        throw new Error(`No se pudo comunicar con el asistente de IA. Detalles: ${errorMessage}`);
    }
};

/**
 * Sends the current prompt, original idea, and user feedback to the Gemini API for refinement.
 * @param idea The user's original idea.
 * @param fileContext Optional content from a user-uploaded file for additional context.
 * @param currentPrompt The current version of the prompt.
 * @param feedback The user's feedback for refinement.
 * @param onComplete Callback function to execute on successful refinement.
 * @returns The refined prompt text.
 */
export const refineGeneratedPrompt = async (idea: string, fileContext: string | null, currentPrompt: string, feedback: string, onComplete: () => void): Promise<string> => {
    checkAiClient();
    if (!currentPrompt || !feedback) {
        throw new Error("No se puede refinar sin el prompt actual y el feedback.");
    }
    try {
        const userContent = `Idea original del usuario: "${idea}".\n\n${fileContext ? `Contexto de archivo proporcionado:\n"""\n${fileContext}\n"""\n\n` : ''}Prompt actual a mejorar:\n"""\n${currentPrompt}\n"""\n\nFeedback del usuario para refinar: "${feedback}".\n\nPor favor, refina el prompt actual basándote en el feedback, manteniendo la esencia de la idea original y aplicando las mejores prácticas de ingeniería de prompts.`;
        
        const response: GenerateContentResponse = await ai!.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userContent,
            config: {
                systemInstruction: REFINE_SYSTEM_INSTRUCTION,
            },
        });
        
        const text = response.text;
        if (text) {
            onComplete(); // Decrement generations count on success
            return text;
        } else {
             throw new Error("La IA no generó una respuesta de texto válida para el refinamiento.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for 'refine':", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
        throw new Error(`No se pudo comunicar con el asistente de IA. Detalles: ${errorMessage}`);
    }
};