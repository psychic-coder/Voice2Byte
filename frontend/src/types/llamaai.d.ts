declare module 'llamaai' {
  interface LlamaAIResponse {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  }

  class LlamaAI {
    constructor(apiToken: string);
    run(params: {
      messages: Array<{ role: string; content: string }>;
      temperature?: number;
      max_tokens?: number;
    }): Promise<LlamaAIResponse>;
  }

  export default LlamaAI;
} 