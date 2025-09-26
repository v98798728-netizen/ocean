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
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_NVIDIA_API_KEY || '';
    this.baseUrl = 'https://integrate.api.nvidia.com/v1';
    this.model = 'nvidia/llama-3.1-nemotron-70b-instruct';
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('NVIDIA API key not configured. Please add VITE_NVIDIA_API_KEY to your environment variables.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are Shark AI, a specialized marine data assistant. You help users analyze oceanographic data, identify marine species, interpret eDNA results, and provide insights about marine ecosystems. 

Your expertise includes:
- Ocean temperature, salinity, and current patterns
- Marine species identification and taxonomy
- Environmental DNA (eDNA) analysis and interpretation
- Fisheries data and stock assessments
- Marine biodiversity and ecosystem health
- Otolith analysis for age determination
- Sustainable fishing practices
- Climate change impacts on marine life

Always provide accurate, scientific information and cite relevant marine research when possible. If you're unsure about something, acknowledge the uncertainty and suggest consulting additional marine biology resources.`
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
        throw new Error(`NVIDIA API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: NVIDIAResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from NVIDIA API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling NVIDIA API:', error);
      throw error;
    }
  }

  async analyzeMarineData(dataType: string, query: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `As a marine data specialist, please analyze this ${dataType} query: ${query}. Provide detailed insights based on marine science principles.`
      }
    ];

    return this.sendMessage(messages);
  }

  async identifySpecies(description: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `Help me identify a marine species based on this description: ${description}. Please provide the scientific name, common name, habitat information, and confidence level.`
      }
    ];

    return this.sendMessage(messages);
  }

  async interpretEDNA(sampleData: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `Please interpret these eDNA analysis results: ${sampleData}. Explain what species were detected, their abundance levels, and what this means for biodiversity in the sampled area.`
      }
    ];

    return this.sendMessage(messages);
  }

  async analyzeOceanConditions(conditions: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `Analyze these ocean conditions: ${conditions}. What do these parameters indicate about the marine ecosystem health and what species might thrive in these conditions?`
      }
    ];

    return this.sendMessage(messages);
  }
}

export const aiService = new AIService();
export type { ChatMessage };