import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatAPI } from '../services/chatAPI';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Available AI models
const AVAILABLE_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable model for complex tasks',
    provider: 'openai',
    maxTokens: 4096,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Faster and cheaper GPT-4o',
    provider: 'openai',
    maxTokens: 16384,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s most capable model',
    provider: 'anthropic',
    maxTokens: 8192,
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and efficient model',
    provider: 'anthropic',
    maxTokens: 4096,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s advanced model',
    provider: 'google',
    maxTokens: 8192,
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient Google model',
    provider: 'google',
    maxTokens: 4096,
  },
];

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [availableModels] = useState(AVAILABLE_MODELS);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    saveData();
  }, [messages, selectedModel, conversationId]);

  const loadSavedData = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('chat_messages');
      const savedModel = await AsyncStorage.getItem('selected_model');
      const savedConversationId = await AsyncStorage.getItem('conversation_id');

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }

      if (savedModel) {
        const model = AVAILABLE_MODELS.find(m => m.id === savedModel);
        if (model) {
          setSelectedModel(model);
        }
      } else {
        // Default to GPT-4o Mini
        setSelectedModel(AVAILABLE_MODELS[1]);
      }

      if (savedConversationId) {
        setConversationId(savedConversationId);
      }
    } catch (error) {
      console.error('Error loading saved chat data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('chat_messages', JSON.stringify(messages));
      if (selectedModel) {
        await AsyncStorage.setItem('selected_model', selectedModel.id);
      }
      if (conversationId) {
        await AsyncStorage.setItem('conversation_id', conversationId);
      }
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  const loadMessages = async () => {
    if (conversationId) {
      try {
        setIsLoading(true);
        const response = await chatAPI.getMessages(conversationId);
        if (response.success) {
          setMessages(response.data || []);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = async (content, model) => {
    if (!content.trim() || !model) {
      throw new Error('Message content and model are required');
    }

    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
      model: model.name,
      modelId: model.id,
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage({
        message: userMessage.content,
        model: model.name,
        modelId: model.id,
        conversationId: conversationId,
        messages: [...messages, userMessage],
      });

      if (response.success && response.data) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: response.data.content,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          model: model.name,
          modelId: model.id,
          conversationId: response.data.conversationId,
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Update conversation ID if this is a new conversation
        if (!conversationId && response.data.conversationId) {
          setConversationId(response.data.conversationId);
        }

        return response.data;
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error.message}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        model: model.name,
        modelId: model.id,
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async () => {
    try {
      setMessages([]);
      setConversationId(null);
      await AsyncStorage.removeItem('chat_messages');
      await AsyncStorage.removeItem('conversation_id');
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const value = {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    conversationId,
    availableModels,
    sendMessage,
    loadMessages,
    clearMessages,
    deleteMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};




