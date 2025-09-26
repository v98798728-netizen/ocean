interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface NVIDIAResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class AIService {
  private baseUrl: string;
  private model: string;

  constructor() {
    // 👇 No API key in frontend anymore
    this.baseUrl = '/api'; 
    this.model = 'nvidia/llama-3.1-nemotron-70b-instruct';
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are Shark AI, a specialized marine data assistant. You help users analyze oceanographic data, identify marine species, interpret eDNA results, and provide insights about marine ecosystems.`
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Backend error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data: NVIDIAResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from NVIDIA API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling backend AI proxy:', error);
      throw error;
    }
  }

  async analyzeMarineData(dataType: string, query: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'user', content: `As a marine data specialist, please analyze this ${dataType} query: ${query}.` }
    ];
    return this.sendMessage(messages);
  }

  async identifySpecies(description: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'user', content: `Help me identify a marine species: ${description}.` }
    ];
    return this.sendMessage(messages);
  }

  async interpretEDNA(sampleData: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'user', content: `Interpret these eDNA results: ${sampleData}.` }
    ];
    return this.sendMessage(messages);
  }

  async analyzeOceanConditions(conditions: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'user', content: `Analyze these ocean conditions: ${conditions}.` }
    ];
    return this.sendMessage(messages);
  }
}

export const aiService = new AIService();
export type { ChatMessage };
