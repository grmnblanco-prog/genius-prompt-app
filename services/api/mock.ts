import { ApiProvider } from './provider';

class MockProvider implements ApiProvider {
  async generatePrompt(prompt: string, fileContent: string | null): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Este es un prompt generado en modo de prueba (mock) basado en la idea: "${prompt}".`);
      }, 1000);
    });
  }

  async refinePrompt(prompt: string, fileContent: string | null, generatedPrompt: string, refinementFeedback: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Este es un prompt refinado en modo de prueba (mock). La idea original era "${prompt}" y el feedback fue "${refinementFeedback}".`);
      }, 1000);
    });
  }
}

export default new MockProvider();
