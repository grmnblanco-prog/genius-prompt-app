import { Prompt, Category } from '../types';
import api from './api';

export class PromptService {
  constructor(private showNotification: (message: string, type?: 'success' | 'error') => void) {}

  async generatePrompt(idea: string, fileContent: string | null): Promise<string> {
    try {
      const result = await api.generatePrompt(idea, fileContent);
      this.showNotification('Prompt generado con éxito.', 'success');
      return result;
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.showNotification(`Error al generar: ${errorMessage}`, 'error');
      throw error;
    }
  }

  async refinePrompt(idea: string, fileContent: string | null, currentPrompt: string, feedback: string): Promise<string> {
    try {
      const result = await api.refinePrompt(idea, fileContent, currentPrompt, feedback);
      this.showNotification('Prompt refinado con éxito.', 'success');
      return result;
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.showNotification(`Error al refinar: ${errorMessage}`, 'error');
      throw error;
    }
  }

  addPrompt(prompts: Prompt[], promptData: Omit<Prompt, 'id' | 'createdAt' | 'isFavorite' | 'isPublished'>): { newPrompts: Prompt[], newPromptId: string } {
    const newPrompt: Prompt = {
      ...promptData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isPublished: false,
    };
    const newPrompts = [newPrompt, ...prompts];
    this.showNotification('¡Prompt guardado con éxito!');
    return { newPrompts, newPromptId: newPrompt.id };
  }

  deletePrompt(prompts: Prompt[], promptId: string): Prompt[] {
    if (window.confirm('¿Estás seguro de que quieres eliminar este prompt? Esta acción no se puede deshacer.')) {
      const newPrompts = prompts.filter(p => p.id !== promptId);
      this.showNotification('Prompt eliminado.', 'error');
      return newPrompts;
    }
    return prompts;
  }

  toggleFavorite(prompts: Prompt[], promptId: string): Prompt[] {
    return prompts.map(p =>
      p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
    );
  }

  publishPrompt(prompts: Prompt[], communityPrompts: Prompt[], promptId: string): { newPrompts: Prompt[], newCommunityPrompts: Prompt[] } {
    let promptToPublish: Prompt | undefined;
    const newPrompts = prompts.map(p => {
      if (p.id === promptId) {
        if (p.isPublished) return p; // Already published
        promptToPublish = { ...p, isPublished: true, author: 'Tú' };
        return promptToPublish;
      }
      return p;
    });

    let newCommunityPrompts = communityPrompts;
    if (promptToPublish && !communityPrompts.some(p => p.id === promptId)) {
      const communityVersion = {
        ...promptToPublish,
        author: 'Tú', // Ensure author is set
        rating: 0,
        downloads: 0,
        createdAt: new Date().toISOString()
      };
      newCommunityPrompts = [communityVersion, ...communityPrompts];
      this.showNotification('¡Prompt publicado en la comunidad!');
    }
    return { newPrompts, newCommunityPrompts };
  }

  importPrompts(prompts: Prompt[], fileContent: string): Prompt[] {
    try {
      const imported = JSON.parse(fileContent);
      if (!Array.isArray(imported)) {
        throw new Error("El archivo no es un array de prompts válido.");
      }

      const validatedPrompts: Prompt[] = imported.filter((p: any) =>
        p.id && p.title && p.content && p.category
      ).map((p: any) => ({ // Ensure all fields are present
        ...p,
        id: p.id || Date.now().toString(),
        createdAt: p.createdAt || new Date().toISOString(),
        isFavorite: p.isFavorite || false,
        isPublished: p.isPublished || false,
      }));

      if (validatedPrompts.length === 0) {
        this.showNotification('No se encontraron prompts válidos en el archivo.', 'error');
        return prompts;
      }

      const existingIds = new Set(prompts.map(p => p.id));
      const newPrompts = validatedPrompts.filter(p => !existingIds.has(p.id));
      this.showNotification(`¡${newPrompts.length} prompts importados con éxito!`);
      return [...prompts, ...newPrompts];

    } catch (error) {
      console.error("Error importing prompts:", error);
      this.showNotification('Error al importar el archivo. Asegúrate de que es un JSON válido exportado desde esta app.', 'error');
      return prompts;
    }
  }
}
