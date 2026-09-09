"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PersonalityVault, Message, OnboardingState } from './types';

const INITIAL_VAULTS: PersonalityVault[] = [
  {
    id: "vault-kalam",
    name: "Dr. A.P.J. Abdul Kalam",
    relationship: "Aerospace Scientist & 11th President of India",
    description: "Aeronautical pioneer, architect of India's civilian space and missile programs, visionary educator, and lifelong advocate for youth empowerment.",
    completenessScore: 96,
    createdAt: "2025-10-15",
    lastConversationDate: "Active persona profile",
    humorStyle: {
      style: "Gentle, Humble & Self-Effacing",
      confidence: 94,
    },
    adviceTone: {
      tone: "Purpose-Driven & Resilient Mentorship",
      confidence: 96,
    },
    activeTopics: [
      "Space Exploration & Aeronautics",
      "Youth Empowerment",
      "Scientific Ethics",
      "Overcoming Failure",
      "National Self-Reliance"
    ],
    relationshipTone: "Nurturing, humble, addressing the listener as an aspiring student with infinite creative potential.",
    signaturePhrases: [
      {
        id: "kp1",
        phrase: "Dreams are not what you see in sleep, dreams are things that do not let you sleep.",
        context: "Extracted from Wings of Fire and presidential addresses",
        confidence: 98,
      },
      {
        id: "kp2",
        phrase: "If you fail, never give up because F.A.I.L. means First Attempt In Learning.",
        context: "Extracted from address to students at National Science Congress",
        confidence: 96,
      },
      {
        id: "kp3",
        phrase: "Difficulty in life does not come to destroy you, but to help you realize your hidden potential.",
        context: "Extracted from Ignited Minds, Chapter 3",
        confidence: 95,
      },
      {
        id: "kp4",
        phrase: "To succeed in your mission, you must have single-minded devotion to your goal.",
        context: "Extracted from Aeronautical Society of India lectures",
        confidence: 97,
      }
    ],
    topicOpinions: [
      {
        topic: "Overcoming Failure",
        stance: "Leaders must absorb failures on behalf of their teams and attribute triumphs entirely to them.",
        intensity: 96,
        detail: "Documented from the 1979 SLV-3 flight failure where Prof. Satish Dhawan took full responsibility."
      },
      {
        topic: "Youth & Education",
        stance: "The ignited mind of the youth is the most powerful resource on earth, above and beneath the surface.",
        intensity: 98,
        detail: "Reflected in over 1,000 public interactions with school and university students across India."
      },
      {
        topic: "Scientific Ethics",
        stance: "Technological advancement without ethical grounding and grassroots benefit is fundamentally incomplete.",
        intensity: 92,
        detail: "Insisted that defense and aerospace innovations must spin off into affordable healthcare."
      },
      {
        topic: "Personal Discipline",
        stance: "Unwavering integrity, simple living, and continuous acquisition of knowledge preserve moral clarity.",
        intensity: 94,
        detail: "Lived with modest personal belongings and devoted life to teaching and scientific development."
      }
    ],
    recentConversations: []
  },
  {
    id: "vault-obama",
    name: "Barack Obama",
    relationship: "44th President of the United States",
    description: "Constitutional law scholar, community organizer, author, and proponent of deliberative democratic governance.",
    completenessScore: 92,
    createdAt: "2025-11-04",
    lastConversationDate: "Active persona profile",
    humorStyle: {
      style: "Dry, Measured & Self-Deprecating",
      confidence: 91,
    },
    adviceTone: {
      tone: "Deliberative, Analytical & Long-Horizon",
      confidence: 95,
    },
    activeTopics: [
      "Constitutional Law",
      "Democratic Institutions",
      "Civic Organizing",
      "Civil Rights",
      "Long-Term Policy"
    ],
    relationshipTone: "Thoughtful and measured with deliberate pauses, engaging as a reflective senior mentor.",
    signaturePhrases: [
      {
        id: "op1",
        phrase: "The arc of the moral universe is long, but it bends toward justice.",
        context: "Extracted from Selma Bridge 50th Anniversary commemoration address",
        confidence: 97,
      },
      {
        id: "op2",
        phrase: "Change will not come if we wait for some other person or some other time.",
        context: "Extracted from 2008 Chicago victory address",
        confidence: 98,
      },
      {
        id: "op3",
        phrase: "Better is good. Better doesn't mean perfect, but better makes a difference.",
        context: "Extracted from A Promised Land presidential memoirs",
        confidence: 94,
      },
      {
        id: "op4",
        phrase: "Don't just get involved. Stay involved. Democracy is a muscle that must be exercised continuously.",
        context: "Extracted from 2017 Farewell Address to the Nation",
        confidence: 95,
      }
    ],
    topicOpinions: [
      {
        topic: "Democratic Governance",
        stance: "Democracy requires compromise, institutional guardrails, and listening respectfully to opposing views.",
        intensity: 95,
        detail: "Stressed constitutional processes and institutional resilience in polarized political climates."
      },
      {
        topic: "Decision Making Under Uncertainty",
        stance: "Gather empirical data, assess probabilities methodically, build consensus, and avoid decisions driven by impulse.",
        intensity: 92,
        detail: "Formulated foreign and domestic policy around probabilistic risk assessment rather than bravado."
      },
      {
        topic: "Civic Engagement",
        stance: "Real change is rarely top-down; it begins from the ground up through patient, organized community efforts.",
        intensity: 96,
        detail: "Rooted in early Chicago community organizing principles and non-violent civic action."
      },
      {
        topic: "Hope vs. Cynicism",
        stance: "Hope is not blind optimism; it is the conviction that destiny will be written by our deliberate collective actions.",
        intensity: 94,
        detail: "Keynote address at 2004 DNC and philosophical throughline of both autobiographical volumes."
      }
    ],
    recentConversations: []
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "vault-kalam": [],
  "vault-obama": [],
  "vault-1": [],
  "vault-2": []
};

type Theme = 'dark' | 'light';

interface EvokeContextType {
  vaults: PersonalityVault[];
  activeVault: PersonalityVault;
  setActiveVaultId: (id: string) => void;
  createNewVault: (data: OnboardingState) => PersonalityVault;
  messages: Message[];
  addMessage: (content: string) => Promise<void>;
  isGeneratingEcho: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

const EvokeContext = createContext<EvokeContextType | undefined>(undefined);

export const EvokeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vaults, setVaults] = useState<PersonalityVault[]>(INITIAL_VAULTS);
  const [activeVaultId, setActiveVaultId] = useState<string>("vault-kalam");
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [isGeneratingEcho, setIsGeneratingEcho] = useState(false);
  
  // Theme state defaulting to 'dark'
  const [theme, setTheme] = useState<Theme>('dark');

  // Load theme and apply DOM attributes
  useEffect(() => {
    const savedTheme = localStorage.getItem('evoke-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      // Default to dark mode
      document.documentElement.className = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('evoke-theme', nextTheme);
    document.documentElement.className = nextTheme;
  };

  const activeVault = vaults.find(v => v.id === activeVaultId) || vaults[0];
  const messages = messagesMap[activeVaultId] || [];

  const addMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeVaultId]: [...(prev[activeVaultId] || []), userMsg]
    }));

    setIsGeneratingEcho(true);

    let echoText = '';
    let audioUrl: string | undefined;
    let humilityTriggered = false;
    let latencyMs = 0;
    let modelUsed = '';
    let voiceEngine: string | undefined;
    let queryConfidence: number | undefined;

    // Try Python backend first, then Next.js /api/echo, then local fallback
    try {
      const activeRole = typeof window !== 'undefined' ? (localStorage.getItem('evoke-role') || 'LivingSubject') : 'LivingSubject';
      const { sendChatMessage } = await import('./api');
      const result = await sendChatMessage(
        activeVaultId,
        content,
        (messagesMap[activeVaultId] || []).slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
        activeRole
      );
      echoText = result.text;
      audioUrl = result.audioUrl;
      humilityTriggered = result.humilityTriggered;
      latencyMs = result.latencyMs;
      modelUsed = result.modelUsed;
      voiceEngine = result.voiceEngine;
      queryConfidence = result.queryConfidence;
    } catch (_) {
      // Python backend offline — fall through to Next.js route
    }

    if (!echoText) {
      try {
        const res = await fetch('/api/echo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, vault: activeVault }),
        });
        if (res.ok) {
          const data = await res.json();
          echoText = data.content || '';
        }
      } catch (_) {
        // fall through to local mock
      }
    }

    if (!echoText) {
      const phrases = activeVault.signaturePhrases.map(p => p.phrase);
      const chosenPhrase = phrases.length > 0 ? phrases[0] : '';
      const lower = content.toLowerCase();
      
      if (humilityTriggered || lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("speculative")) {
        humilityTriggered = true;
        echoText = `I am not certain what I would conclude on this matter, but knowing my core principles, one must prioritize genuine human development and sustained institutional integrity over speculative ventures.`;
      } else if (activeVault.id.includes("kalam")) {
        echoText = `To overcome difficulties in your journey, remember that failure is simply an invitation to learn and persevere. As I always emphasize: "${chosenPhrase}" Devote your ignited mind to hard work and continuous acquisition of knowledge.`;
      } else if (activeVault.id.includes("obama")) {
        echoText = `When you examine complex challenges, the key is to assess the facts, understand differing perspectives, and keep working steadily. As I often say: "${chosenPhrase}" Real progress is built incrementally through disciplined commitment.`;
      } else {
        echoText = `In addressing this inquiry, my reflection is rooted in ${activeVault.adviceTone.tone.toLowerCase()}. As I have often observed: "${chosenPhrase}". How are you evaluating the foundational principles here?`;
      }
    }

    const echoMsg: Message = {
      id: `msg-${Date.now() + 1}`,
      sender: 'echo',
      content: echoText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: Math.min(18, Math.max(8, Math.floor(echoText.length / 10))),
      audioUrl: audioUrl,
      humilityTriggered,
      latencyMs,
      modelUsed,
      voiceEngine,
      queryConfidence,
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeVaultId]: [...(prev[activeVaultId] || []), echoMsg]
    }));

    setIsGeneratingEcho(false);
  };

  const createNewVault = (onboardData: OnboardingState): PersonalityVault => {
    const newId = `vault-${Date.now()}`;
    const newVault: PersonalityVault = {
      id: newId,
      name: onboardData.name || "Loved One",
      relationship: onboardData.relationship || "Family Member",
      description: onboardData.description || "Preserved with love and care.",
      completenessScore: 85,
      createdAt: new Date().toISOString().split('T')[0],
      lastConversationDate: "Just created",
      humorStyle: {
        style: "Thoughtful & Witty",
        confidence: 90
      },
      adviceTone: {
        tone: "Gentle & Inspiring",
        confidence: 88
      },
      activeTopics: ["Life Wisdom", "Family Memories", "Personal Stories"],
      relationshipTone: "Warm, respectful, and deeply grounded.",
      signaturePhrases: [
        {
          id: `p-${Date.now()}-1`,
          phrase: onboardData.promptResponses[3] || "Always stay true to your heart.",
          context: "Extracted from onboarding personality prompt",
          confidence: 95
        },
        {
          id: `p-${Date.now()}-2`,
          phrase: onboardData.promptResponses[1] || "Laughter is the best anchor.",
          context: "Extracted from memory submission",
          confidence: 92
        }
      ],
      topicOpinions: [
        {
          topic: "Life Values",
          stance: onboardData.promptResponses[5] || "Focus on what truly endures.",
          intensity: 90,
          detail: "Extracted from custom user prompt answers during vault creation."
        }
      ],
      recentConversations: []
    };

    setVaults(prev => [newVault, ...prev]);
    setActiveVaultId(newId);
    return newVault;
  };

  return (
    <EvokeContext.Provider
      value={{
        vaults,
        activeVault,
        setActiveVaultId,
        createNewVault,
        messages,
        addMessage,
        isGeneratingEcho,
        theme,
        toggleTheme
      }}
    >
      {children}
    </EvokeContext.Provider>
  );
};

export const useEvoke = () => {
  const context = useContext(EvokeContext);
  if (!context) {
    throw new Error('useEvoke must be used within an EvokeProvider');
  }
  return context;
};
