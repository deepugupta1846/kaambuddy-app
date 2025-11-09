import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';
import styles from './ChatTab.styles';

const ChatTab = () => {
  const { user } = useAuth();
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    loadMessages,
    selectedModel,
    setSelectedModel,
    availableModels 
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedModel) {
      Alert.alert('Error', 'Please select a model and enter a message');
      return;
    }

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      await sendMessage(messageText, selectedModel);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.role === 'user';
    const isLastMessage = index === messages.length - 1;
    const showTyping = isLastMessage && isTyping && !isUser;

    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage
      ]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {item.content}
          </Text>
          
          {item.model && (
            <Text style={styles.modelText}>
              {item.model}
            </Text>
          )}
          
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        
        {isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.assistantMessage]}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>🤖</Text>
      </View>
      <View style={[styles.messageBubble, styles.assistantBubble]}>
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#666" />
          <Text style={styles.typingText}>AI is typing...</Text>
        </View>
      </View>
    </View>
  );

  const renderModelSelector = () => (
    <View style={styles.modelSelector}>
      <Text style={styles.modelSelectorLabel}>Select AI Model:</Text>
      <View style={styles.modelButtons}>
        {availableModels.map((model) => (
          <TouchableOpacity
            key={model.id}
            style={[
              styles.modelButton,
              selectedModel?.id === model.id && styles.selectedModelButton
            ]}
            onPress={() => setSelectedModel(model)}
          >
            <Text style={[
              styles.modelButtonText,
              selectedModel?.id === model.id && styles.selectedModelButtonText
            ]}>
              {model.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>💬</Text>
      <Text style={styles.emptyStateTitle}>Start a Conversation</Text>
      <Text style={styles.emptyStateText}>
        Select an AI model and start chatting! Ask questions, get help, or just have a conversation.
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderModelSelector()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={isTyping ? renderTypingIndicator : null}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputMessage.trim() || !selectedModel) && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!inputMessage.trim() || !selectedModel || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatTab;



