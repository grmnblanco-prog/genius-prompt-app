import { ApiProvider } from './provider';

class GeminiProvider implements ApiProvider {
  private async callApi(type: 'generate' | 'refine', payload: any): Promise<string> {
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
        throw new Error(data.error || `Error del servidor: ${response.statusText}`);
      }

      if (!data.text) {
        throw new Error('La respuesta de la API no contenía texto.');
      }

      return data.text;
    } catch (error) {
      console.error(`Error calling API for '${type}':`, error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido.';
      throw new Error(`No se pudo comunicar con el asistente de IA. Detalles: ${errorMessage}`);
    }
  }

  async generatePrompt(prompt: string, fileContent: string | null): Promise<string> {
    if (!prompt.trim() && !fileContent) {
      throw new Error('Por favor, proporciona una idea o un archivo de contexto para el prompt.');
    }

    const payload = { idea: prompt, fileContent: fileContent };
    return this.callApi('generate', payload);
  }

  async refinePrompt(prompt: string, fileContent: string | null, generatedPrompt: string, refinementFeedback: string): Promise<string> {
    if (!generatedPrompt || !refinementFeedback) {
      throw new Error('No se puede refinar sin el prompt actual y el feedback.');
    }

    const payload = { idea: prompt, fileContent: fileContent, currentPrompt: generatedPrompt, feedback: refinementFeedback };
    return this.callApi('refine', payload);
  }
}

export default new GeminiProvider();
