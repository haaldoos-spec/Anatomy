'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import { Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export default function ChatPage() {
  const { t, language } = useLanguage();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const response = await api.get('/chat');
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await api.get(`/chat/${chatId}/messages`);
      // Adapt backend field names if necessary (backend uses role/content)
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    setIsTyping(true);
    
    // Optimistically add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await api.post('/chat', {
        chatId: currentChatId,
        message: text,
        language: language,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      if (!currentChatId) {
        setCurrentChatId(response.data.chatId);
        fetchChats();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Could add error message to UI here
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={handleNewChat}
        />
        
        <div className="flex-1 flex flex-col relative bg-white">
          {/* Header */}
          <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center border border-green-200">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{t('chat.title')}</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500 font-medium">Online & Ready to Help</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Expert Mode</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-10">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
                    <Bot className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('chat.welcome')}</h2>
                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    {t('chat.welcome_desc')}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-xl">
                    {['Explain the nervous system', 'How many bones are in the hand?', 'What does the spleen do?', 'Functions of the liver'].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-600 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all text-left group"
                      >
                        <p className="font-medium group-hover:text-blue-600">{q}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.created_at}
                    />
                  ))}
                  {isTyping && (
                    <div className="flex items-start mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 border border-green-200 shadow-sm">
                        <Bot className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="max-w-4xl mx-auto w-full px-8 pb-8 pt-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex justify-center">
                <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                  AnatoMentor AI Tutor • Trained on Human Anatomy & Physiology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
