import { API_BASE_URL } from '../config/api';

// Mock API responses for development
const MOCK_RESPONSES = {
  'gpt-4o': {
    content: "Hello! I'm GPT-4o, OpenAI's most advanced model. I can help you with a wide range of tasks including analysis, creative writing, coding, and problem-solving. How can I assist you today?",
    conversationId: 'conv_' + Date.now(),
  },
  'gpt-4o-mini': {
    content: "Hi there! I'm GPT-4o Mini, a faster and more cost-effective version of GPT-4o. I'm great for quick responses and everyday tasks. What would you like to know?",
    conversationId: 'conv_' + Date.now(),
  },
  'claude-3-5-sonnet': {
    content: "Hello! I'm Claude 3.5 Sonnet, Anthropic's most capable AI assistant. I'm designed to be helpful, harmless, and honest. I can assist with analysis, writing, coding, and much more. How can I help you?",
    conversationId: 'conv_' + Date.now(),
  },
  'claude-3-haiku': {
    content: "Hi! I'm Claude 3 Haiku, a fast and efficient AI model. I'm great for quick tasks and responses. What can I help you with today?",
    conversationId: 'conv_' + Date.now(),
  },
  'gemini-1.5-pro': {
    content: "Hello! I'm Gemini 1.5 Pro, Google's advanced AI model. I can help with complex reasoning, analysis, and creative tasks. How may I assist you?",
    conversationId: 'conv_' + Date.now(),
  },
  'gemini-1.5-flash': {
    content: "Hi there! I'm Gemini 1.5 Flash, a fast and efficient Google AI model. I'm perfect for quick responses and everyday questions. What would you like to know?",
    conversationId: 'conv_' + Date.now(),
  },
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ChatAPI {
  constructor() {
    this.baseURL = API_BASE_URL || 'http://localhost:3000/api';
  }

  async sendMessage({ message, model, modelId, conversationId, messages }) {
    try {
      // For development, use mock responses
      if (__DEV__) {
        await delay(1000 + Math.random() * 2000); // Simulate network delay
        
        const mockResponse = MOCK_RESPONSES[modelId] || MOCK_RESPONSES['gpt-4o-mini'];
        
        // Generate a more contextual response based on the message
        let contextualResponse = this.generateContextualResponse(message, modelId);
        
        return {
          success: true,
          data: {
            content: contextualResponse,
            conversationId: conversationId || mockResponse.conversationId,
            model: model,
            modelId: modelId,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Production API call
      const response = await fetch(`${this.baseURL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          message,
          model,
          modelId,
          conversationId,
          messages: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getMessages(conversationId) {
    try {
      if (__DEV__) {
        // Return empty array for development
        return {
          success: true,
          data: [],
        };
      }

      const response = await fetch(`${this.baseURL}/chat/messages/${conversationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting messages:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  async getConversations() {
    try {
      if (__DEV__) {
        return {
          success: true,
          data: [],
        };
      }

      const response = await fetch(`${this.baseURL}/chat/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  async deleteConversation(conversationId) {
    try {
      if (__DEV__) {
        return {
          success: true,
        };
      }

      const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  generateContextualResponse(message, modelId) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! I'm ${this.getModelName(modelId)}. How can I help you today?`;
    }
    
    // Question responses
    if (lowerMessage.includes('?') || lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('why')) {
      return `That's an interesting question! As ${this.getModelName(modelId)}, I'd be happy to help you with that. Could you provide a bit more context so I can give you a more specific and helpful answer?`;
    }
    
    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return `I'm here to help! As ${this.getModelName(modelId)}, I can assist with a wide range of tasks including answering questions, providing explanations, helping with analysis, creative writing, coding, and much more. What specific area would you like help with?`;
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return `You're very welcome! I'm glad I could help. Is there anything else you'd like to know or discuss?`;
    }
    
    // Default contextual response
    return `I understand you're asking about "${message}". As ${this.getModelName(modelId)}, I'm here to help with that and any other questions you might have. Could you tell me more about what specifically you'd like to know?`;
  }

  getModelName(modelId) {
    const modelNames = {
      'gpt-4o': 'GPT-4o',
      'gpt-4o-mini': 'GPT-4o Mini',
      'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
      'claude-3-haiku': 'Claude 3 Haiku',
      'gemini-1.5-pro': 'Gemini 1.5 Pro',
      'gemini-1.5-flash': 'Gemini 1.5 Flash',
    };
    return modelNames[modelId] || 'AI Assistant';
  }

  async getAuthToken() {
    // This would typically get the auth token from your auth context or storage
    // For now, return null for development
    return null;
  }
}

export const chatAPI = new ChatAPI();




