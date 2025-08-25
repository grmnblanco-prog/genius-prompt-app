
const callApi = async (type: 'generate' | 'refine', payload: any): Promise<string> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, payload }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Use the error message from the serverless function, or a default one
            throw new Error(data.error || `Error del servidor: ${response.statusText}`);
        }
        
        if (!data.text) {
            throw new Error("La respuesta de la API no contenía texto.");
        }

        return data.text;

    } catch (error) {
        console.error(`Error calling API for '${type}':`, error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
        // Re-throw a user-friendly error message
        throw new Error(`No se pudo comunicar con el asistente de IA. Detalles: ${errorMessage}`);
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
    if (!idea.trim() && !fileContext) {
        throw new Error("Por favor, proporciona una idea o un archivo de contexto para el prompt.");
    }
    
    const payload = { idea, fileContext };
    const text = await callApi('generate', payload);

    onComplete(); // Decrement generations count on success
    return text;
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
    if (!currentPrompt || !feedback) {
        throw new Error("No se puede refinar sin el prompt actual y el feedback.");
    }

    const payload = { idea, fileContext, currentPrompt, feedback };
    const text = await callApi('refine', payload);
    
    onComplete(); // Decrement generations count on success
    return text;
};
