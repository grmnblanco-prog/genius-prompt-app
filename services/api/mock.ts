import { ApiProvider } from './provider';

class MockProvider implements ApiProvider {
  async generatePrompt(prompt: string, fileContent: string | null): Promise<string> {
    console.log('MockProvider: generatePrompt called with:', { prompt, fileContent });
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Este es un prompt generado por el mock provider para la idea: "${prompt}".`;
  }

  async refinePrompt(prompt: string, fileContent: string | null, generatedPrompt: string, refinementFeedback: string): Promise<string> {
    console.log('MockProvider: refinePrompt called with:', { prompt, fileContent, generatedPrompt, refinementFeedback });
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Este es un prompt refinado por el mock provider. Feedback: "${refinementFeedback}".`;
  }
}

export default new MockProvider();
