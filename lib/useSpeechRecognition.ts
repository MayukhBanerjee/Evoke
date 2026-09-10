"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

export interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: (options?: SpeechRecognitionOptions) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  clearError: () => void;
}

// Browser Web Speech API type definitions for Chrome webkitSpeechRecognition
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: {
    length: number;
    item(index: number): SpeechRecognitionResultLike;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternativeLike;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorLike extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((event: Event) => void) | null;
  onaudioend: ((event: Event) => void) | null;
  onspeechstart: ((event: Event) => void) | null;
  onspeechend: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
  }
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldListenRef = useRef<boolean>(false);
  const hasFatalErrorRef = useRef<boolean>(false);
  const optionsRef = useRef<SpeechRecognitionOptions>({});
  const accumulatedFinalRef = useRef<string>('');

  // Check browser support on client mount
  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(supported);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    hasFatalErrorRef.current = false;
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    accumulatedFinalRef.current = '';
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    hasFatalErrorRef.current = false;
    setIsListening(false);
    setIsSpeaking(false);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition might already be stopped
      }
    }
  }, []);

  const startListening = useCallback((options?: SpeechRecognitionOptions) => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome for the best experience.');
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Safe to ignore
      }
    }

    clearError();
    shouldListenRef.current = true;
    hasFatalErrorRef.current = false;
    optionsRef.current = options || {};

    const continuous = options?.continuous ?? true;
    const interimResults = options?.interimResults ?? true;
    const lang = options?.lang || (typeof navigator !== 'undefined' ? navigator.language : 'en-US') || 'en-US';

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onaudiostart = () => {
        setIsSpeaking(true);
      };

      recognition.onspeechstart = () => {
        setIsSpeaking(true);
      };

      recognition.onspeechend = () => {
        setIsSpeaking(false);
      };

      recognition.onaudioend = () => {
        setIsSpeaking(false);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentInterim = '';
        let newlyFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const segment = result[0]?.transcript || '';
          if (result.isFinal) {
            newlyFinal += segment;
          } else {
            currentInterim += segment;
          }
        }

        if (newlyFinal) {
          accumulatedFinalRef.current = accumulatedFinalRef.current
            ? `${accumulatedFinalRef.current.trim()} ${newlyFinal.trim()}`
            : newlyFinal.trim();
        }

        const totalActive = currentInterim
          ? (accumulatedFinalRef.current ? `${accumulatedFinalRef.current.trim()} ${currentInterim.trim()}` : currentInterim.trim())
          : accumulatedFinalRef.current;

        setTranscript(accumulatedFinalRef.current);
        setInterimTranscript(currentInterim);

        if (optionsRef.current.onResult) {
          optionsRef.current.onResult(totalActive, Boolean(newlyFinal && !currentInterim));
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorLike) => {
        const errType = event.error;

        // Chrome error types:
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          hasFatalErrorRef.current = true;
          shouldListenRef.current = false;
          setIsListening(false);
          setIsSpeaking(false);
          const msg = 'Microphone access was blocked. Please click the icon in Chrome’s URL bar to allow microphone access.';
          setError(msg);
          optionsRef.current.onError?.(msg);
        } else if (errType === 'audio-capture') {
          hasFatalErrorRef.current = true;
          shouldListenRef.current = false;
          setIsListening(false);
          setIsSpeaking(false);
          const msg = 'No microphone was found. Please check that your audio input device is connected.';
          setError(msg);
          optionsRef.current.onError?.(msg);
        } else if (errType === 'network') {
          // Network issue reaching speech recognition service
          const msg = 'Speech recognition network error. Please verify your connection.';
          setError(msg);
          optionsRef.current.onError?.(msg);
        } else if (errType === 'no-speech') {
          // Silent timeout - don't mark fatal if user wants continuous listening
          setIsSpeaking(false);
        } else if (errType === 'aborted') {
          // Aborted by user or restart, normal behavior
          setIsSpeaking(false);
        } else {
          const msg = `Speech recognition notice: ${errType}`;
          setError(msg);
          optionsRef.current.onError?.(msg);
        }
      };

      recognition.onend = () => {
        setIsSpeaking(false);

        // If continuous listening is desired and no fatal permission/hardware error occurred, restart
        if (shouldListenRef.current && !hasFatalErrorRef.current && continuous) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
          shouldListenRef.current = false;
        }
      };

      recognition.start();
    } catch (err: any) {
      setError(err?.message || 'Failed to start speech recognition.');
      setIsListening(false);
      shouldListenRef.current = false;
    }
  }, [clearError]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Safe to ignore
        }
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    clearError,
  };
}
