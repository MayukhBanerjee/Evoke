"use client";

import React, { useState } from 'react';
import { Message } from '@/lib/types';
import { AudioWaveform } from './AudioWaveform';

interface MessageBubbleProps {
  message: Message;
  echoName: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, echoName }) => {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const isUser = message.sender === 'user';

  return (
    <div
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
      className={`w-full py-4 flex flex-col transition-all relative ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div className={`max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <span className="font-syne font-bold text-xs text-[#7C6AFF]">
              {echoName}'s Echo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECCA3] shadow-[0_0_6px_#4ECCA3]" />
          </div>
        )}

        {/* Audio Waveform Player for Echo */}
        {!isUser && (
          <AudioWaveform durationSeconds={message.durationSeconds || 14} />
        )}

        {/* Text Message Content */}
        <div
          className={`text-base sm:text-lg leading-relaxed font-light ${
            isUser
              ? 'text-[#9090A8] pl-8'
              : 'text-[#F0F0F8] border-l-2 border-[#7C6AFF] pl-4 bg-gradient-to-r from-[#7C6AFF]/5 to-transparent py-1'
          }`}
        >
          {message.content}
        </div>

        {/* Subtle Hover Timestamp */}
        <div
          className={`text-[11px] font-mono text-[#55556A] mt-1.5 transition-opacity duration-200 ${
            showTimestamp ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
