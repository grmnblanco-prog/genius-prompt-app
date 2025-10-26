export interface ApiProvider {
  generatePrompt(prompt: string, fileContent: string | null): Promise<string>;
  refinePrompt(prompt: string, fileContent: string | null, generatedPrompt: string, refinementFeedback: string): Promise<string>;
}
