export interface SignaturePhrase {
  id: string;
  phrase: string;
  context: string;
  confidence: number;
}

export interface TopicOpinion {
  topic: string;
  stance: string;
  intensity: number; // 0 to 100
  detail: string;
}

export interface RecentConversationSummary {
  id: string;
  timestamp: string;
  snippet: string;
  duration?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'echo';
  content: string;
  timestamp: string;
  audioUrl?: string;
  durationSeconds?: number;
  humilityTriggered?: boolean;
  latencyMs?: number;
  modelUsed?: string;
  voiceEngine?: string;
  queryConfidence?: number;
}

export interface PersonalityVault {
  id: string;
  name: string;
  relationship: string;
  description: string;
  completenessScore: number; // 0 - 100
  createdAt: string;
  lastConversationDate: string;
  avatarUrl?: string;
  voiceSampleUrl?: string;
  
  // Personality Traits
  humorStyle: {
    style: string;
    confidence: number;
  };
  adviceTone: {
    tone: string;
    confidence: number;
  };
  activeTopics: string[];
  relationshipTone: string;
  
  signaturePhrases: SignaturePhrase[];
  topicOpinions: TopicOpinion[];
  recentConversations: RecentConversationSummary[];
}

export interface OnboardingState {
  name: string;
  relationship: string;
  description: string;
  audioFileName?: string;
  audioDurationSeconds?: number;
  recordedAudioUrl?: string;
  audioFile?: File;
  promptResponses: Record<number, string>;
  hasChatExport: boolean;
  hasLetters: boolean;
}
