"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MessageSquare, BookOpen, Upload, CheckCircle2, ArrowRight } from 'lucide-react';

interface FileUploaderProps {
  onCompleteStep: (chatUploaded: boolean, lettersUploaded: boolean) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onCompleteStep }) => {
  const [chatUploaded, setChatUploaded] = useState(false);
  const [chatFileName, setChatFileName] = useState('');
  const [lettersUploaded, setLettersUploaded] = useState(false);
  const [lettersFileName, setLettersFileName] = useState('');

  const handleChatUpload = () => {
    setChatUploaded(true);
    setChatFileName("WhatsApp_Chat_Export_2020_2024.txt");
  };

  const handleLettersUpload = () => {
    setLettersUploaded(true);
    setLettersFileName("Personal_Letters_Scanned.pdf");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <p className="text-xs text-evoke-text-secondary font-light">
          Optional: Deepen their echo's phrase memory with written correspondence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Chat Export */}
        <Card 
          className={`p-6 border-evoke-border ${chatUploaded ? 'border-[#4ECCA3]/50 bg-evoke-surface' : 'bg-evoke-card'}`}
          hoverEffect={true}
          borderTheme={chatUploaded ? 'violet' : 'gold'}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#7C6AFF]/10 border border-[#7C6AFF]/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-[#7C6AFF]" />
            </div>
            <div>
              <h4 className="font-syne font-bold text-base text-evoke-text-primary">WhatsApp Chat Export</h4>
              <p className="text-xs text-evoke-text-secondary font-light mt-1">
                Extracts signature phrases, texting style, emojis, and daily conversational rhythms.
              </p>
            </div>
          </div>

          {chatUploaded ? (
            <div className="p-3 rounded-[10px] bg-evoke-card border border-[#4ECCA3]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#4ECCA3] font-mono truncate">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{chatFileName}</span>
              </div>
              <button
                onClick={() => setChatUploaded(false)}
                className="text-[11px] text-evoke-text-muted hover:text-evoke-text-primary"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-evoke-border hover:border-[#7C6AFF]/50 rounded-[10px] bg-evoke-surface cursor-pointer text-xs font-semibold text-[#7C6AFF] dark:text-[#9D8FFF]">
              <input type="file" accept=".txt,.zip" onChange={handleChatUpload} className="hidden" />
              <Upload className="w-4 h-4" />
              Upload .txt export
            </label>
          )}
        </Card>

        {/* Personal Letters or Journals */}
        <Card 
          className={`p-6 border-evoke-border ${lettersUploaded ? 'border-[#4ECCA3]/50 bg-evoke-surface' : 'bg-evoke-card'}`}
          hoverEffect={true}
          borderTheme={lettersUploaded ? 'violet' : 'gold'}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="font-syne font-bold text-base text-evoke-text-primary">Letters & Journals</h4>
              <p className="text-xs text-evoke-text-secondary font-light mt-1">
                Scanned handwritten letters, emails, or personal journal passages containing life advice.
              </p>
            </div>
          </div>

          {lettersUploaded ? (
            <div className="p-3 rounded-[10px] bg-evoke-card border border-[#4ECCA3]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#4ECCA3] font-mono truncate">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{lettersFileName}</span>
              </div>
              <button
                onClick={() => setLettersUploaded(false)}
                className="text-[11px] text-evoke-text-muted hover:text-evoke-text-primary"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-evoke-border hover:border-[#C5A880]/50 rounded-[10px] bg-evoke-surface cursor-pointer text-xs font-semibold text-[#C5A880]">
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleLettersUpload} className="hidden" />
              <Upload className="w-4 h-4" />
              Upload document / PDF
            </label>
          )}
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-evoke-border">
        <Button
          variant="ghost"
          size="md"
          onClick={() => onCompleteStep(chatUploaded, lettersUploaded)}
        >
          Skip This Step
        </Button>

        <Button
          variant="gold"
          size="lg"
          onClick={() => onCompleteStep(chatUploaded, lettersUploaded)}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Build Memory Vault
        </Button>
      </div>
    </div>
  );
};
