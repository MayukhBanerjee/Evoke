"use client";

import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Mic, UploadCloud, CheckCircle2, Play, Pause, RefreshCw, Volume2 } from 'lucide-react';

interface VoiceUploaderProps {
  onFileSelect: (fileName: string, duration: number) => void;
  selectedFileName?: string;
}

export const VoiceUploader: React.FC<VoiceUploaderProps> = ({
  onFileSelect,
  selectedFileName,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(!!selectedFileName);
  const [fileName, setFileName] = useState(selectedFileName || '');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordTime(0);
    timerRef.current = setInterval(() => {
      setRecordTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    const recordedName = `Live_Record_${new Date().toISOString().slice(0,10)}.mp3`;
    setFileName(recordedName);
    setFileUploaded(true);
    onFileSelect(recordedName, Math.max(62, recordTime));
  };

  const handleSimulatedDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileUploaded(true);
      onFileSelect(file.name, 75);
    } else {
      // Demo fallback
      const demoName = "Dad_Story_Recording_2023.mp3";
      setFileName(demoName);
      setFileUploaded(true);
      onFileSelect(demoName, 94);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {!fileUploaded ? (
        <div className="flex flex-col gap-4">
          {/* Drag and Drop Zone */}
          <label className="relative flex flex-col items-center justify-center p-10 border-2 border-dashed border-[#1E1E30] hover:border-[#7C6AFF]/60 rounded-[14px] bg-[#0F0F1A] hover:bg-[#14141F] transition-all cursor-pointer group">
            <input
              type="file"
              accept=".mp3,.wav,.m4a"
              onChange={handleSimulatedDrop}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-[#7C6AFF]/10 border border-[#7C6AFF]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7 text-[#7C6AFF]" />
            </div>

            <p className="font-syne font-bold text-base text-[#F0F0F8] mb-1">
              Drag & drop voice audio file here
            </p>
            <p className="text-xs text-[#9090A8] font-light mb-4">
              Supports MP3, WAV, M4A — minimum 60 seconds recommended
            </p>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#7C6AFF]/15 text-[#9D8FFF] text-xs font-medium border border-[#7C6AFF]/30">
              <UploadCloud className="w-4 h-4" />
              Browse Files
            </span>
          </label>

          {/* Secondary Option: Record Directly */}
          <div className="relative flex items-center justify-center my-2">
            <span className="h-px bg-[#1E1E30] w-full" />
            <span className="absolute px-3 bg-[#14141F] text-xs text-[#55556A] uppercase font-mono tracking-wider">
              Or Record Live
            </span>
          </div>

          <div className="p-6 rounded-[14px] bg-[#0F0F1A] border border-[#1E1E30] flex flex-col items-center justify-center gap-4 text-center">
            {isRecording ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center z-10">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-red-400 font-mono font-medium">
                  Recording Live ({recordTime}s)
                </p>
                {/* Live Waveform Pulse */}
                <div className="flex items-center gap-1 h-8">
                  {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 75, 45].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#7C6AFF] rounded-full animate-wave"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <Button variant="danger" size="sm" onClick={stopRecording}>
                  Stop & Save Recording
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="md"
                onClick={startRecording}
                icon={<Mic className="w-4 h-4 text-[#7C6AFF]" />}
              >
                Record Directly from Microphone
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Waveform Visualization of Uploaded File */
        <Card className="p-6 border-[#4ECCA3]/40 bg-[#0F0F1A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4ECCA3]/10 border border-[#4ECCA3]/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#4ECCA3]" />
              </div>
              <div>
                <h4 className="font-syne font-bold text-sm text-[#F0F0F8]">
                  {fileName}
                </h4>
                <p className="text-xs text-[#4ECCA3] font-mono">
                  Voice pattern extracted · 1 min 24 sec audio
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFileUploaded(false)}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Replace
            </Button>
          </div>

          {/* Audio Waveform Canvas Representation */}
          <div className="p-4 rounded-[10px] bg-[#14141F] border border-[#1E1E30] flex items-center gap-4">
            <button
              onClick={() => setIsPlayingPreview(!isPlayingPreview)}
              className="w-10 h-10 rounded-full bg-[#7C6AFF] hover:bg-[#9D8FFF] text-white flex items-center justify-center shrink-0 transition-all shadow-glow"
            >
              {isPlayingPreview ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Simulated Waveform Bars */}
            <div className="flex-grow flex items-center gap-1 h-10">
              {[25, 45, 75, 90, 60, 40, 85, 100, 70, 50, 30, 65, 80, 95, 40, 60, 70, 85, 30, 50, 40, 65, 80, 30, 20, 45, 60, 80, 50, 35].map((val, i) => (
                <div
                  key={i}
                  className={`flex-grow rounded-full transition-all duration-300 ${
                    isPlayingPreview && i < 15
                      ? 'bg-[#4ECCA3]'
                      : 'bg-[#7C6AFF]/40'
                  }`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>

            <span className="text-xs font-mono text-[#9090A8] shrink-0">
              {isPlayingPreview ? '0:14 / 1:24' : '1:24'}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};
