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
            <span className="font-syne font-bold text-xs text-[#C5A880] dark:text-[#9D8FFF]">
              {echoName}'s Echo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECCA3] shadow-[0_0_6px_#4ECCA3]" />
          </div>
        )}

        {/* Humility Gate Badge */}
        {!isUser && message.humilityTriggered && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[100px] bg-[#FF9A3C]/10 border border-[#FF9A3C]/30 text-[10px] font-mono text-[#FF9A3C] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9A3C]" />
            Humility Gate (&tau;=0.70){message.queryConfidence !== undefined ? ` &bull; conf: ${message.queryConfidence}` : ''}
          </div>
        )}


        {/* Audio Waveform Player for Echo (active only when TTS audio is synthesized) */}
        {!isUser && message.audioUrl && (
          <AudioWaveform durationSeconds={message.durationSeconds || 14} audioUrl={message.audioUrl} />
        )}

        {/* Text Message Content */}
        <div
          className={`text-base sm:text-lg leading-relaxed font-light ${
            isUser
              ? 'text-evoke-text-secondary pl-8'
              : 'text-evoke-text-primary border-l-2 border-[#C5A880] pl-4 bg-gradient-to-r from-[#C5A880]/5 to-transparent py-1'
          }`}
        >
          {message.content}
        </div>

        {/* Subtle Hover Timestamp */}
        <div
          className={`text-[11px] font-mono text-evoke-text-muted mt-1.5 transition-opacity duration-200 ${
            showTimestamp ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
