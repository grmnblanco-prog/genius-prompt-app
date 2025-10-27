import { ApiProvider } from './provider';
import geminiProvider from './gemini';
import mockProvider from './mock';

const providers: { [key: string]: ApiProvider } = {
  gemini: geminiProvider,
  mock: mockProvider,
};

import { config } from '../../config';

const activeProvider = config.apiProvider;

const api: ApiProvider = providers[activeProvider];

export default api;
