'use client';

import React from 'react';
import { MessageSquare, Plus, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
}

export default function ChatSidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat,
  isLoading 
}: ChatSidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="w-80 flex flex-col bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          {t('chat.new_chat')}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-3 h-3" />
          {t('chat.history')}
        </div>
        
        <div className="space-y-1 mt-1">
          {chats.length === 0 && !isLoading && (
            <p className="px-3 py-4 text-sm text-gray-400 italic">
              {t('chat.no_history')}
            </p>
          )}
          
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                currentChatId === chat.id 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${currentChatId === chat.id ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="flex-1 text-left truncate">
                <p className="text-sm font-medium truncate">{chat.title}</p>
                <p className="text-[10px] text-gray-400">
                  {new Date(chat.created_at).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
