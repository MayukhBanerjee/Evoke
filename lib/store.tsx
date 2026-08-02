"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PersonalityVault, Message, OnboardingState } from './types';

const INITIAL_VAULTS: PersonalityVault[] = [
  {
    id: "vault-1",
    name: "Rajesh Banerjee",
    relationship: "Your Father",
    description: "Structural engineer, avid chai drinker, lover of vintage radios and quiet wisdom.",
    completenessScore: 94,
    createdAt: "2025-11-14",
    lastConversationDate: "Yesterday at 9:42 PM",
    voiceSampleUrl: "https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg", // standard sample placeholder
    humorStyle: {
      style: "Dry & Sarcastic",
      confidence: 96,
    },
    adviceTone: {
      tone: "Tough Love & Pragmatic",
      confidence: 92,
    },
    activeTopics: [
      "Family Legacy",
      "Engineering",
      "Gardening",
      "Financial Independence",
      "Classic Rock"
    ],
    relationshipTone: "Warmly protective, calls you 'kiddo', expects excellence with quiet pride.",
    signaturePhrases: [
      {
        id: "p1",
        phrase: "Did you measure twice before you cut once?",
        context: "Extracted from voice note discussing your career choice in 2021",
        confidence: 98,
      },
      {
        id: "p2",
        phrase: "Listen kiddo, life doesn't hand out refunds.",
        context: "Extracted from journal entry during college application season",
        confidence: 95,
      },
      {
        id: "p3",
        phrase: "Let's grab a hot chai first, then we'll fix it.",
        context: "Extracted from home audio recording on Sunday mornings",
        confidence: 97,
      },
      {
        id: "p4",
        phrase: "Always build things to last fifty years.",
        context: "Extracted from WhatsApp chat export regarding house renovation",
        confidence: 92,
      }
    ],
    topicOpinions: [
      {
        topic: "Career & Ambition",
        stance: "Strive for quiet mastery over loud shortcuts. Your work is your signature.",
        intensity: 92,
        detail: "He firmly believed that consistency outperforms talent when talent lacks discipline."
      },
      {
        topic: "Relationships",
        stance: "Show up when it matters most, especially when it's inconvenient.",
        intensity: 95,
        detail: "Prioritized physical presence and quiet support over grand declarations."
      },
      {
        topic: "Handling Failure",
        stance: "Failure is just expensive tuition. Learn the lesson quickly.",
        intensity: 88,
        detail: "Never allowed wallowing; insisted on writing down 3 steps to recover immediately."
      },
      {
        topic: "Money & Security",
        stance: "Keep debts zero, invest in books and tools, live below your means.",
        intensity: 90,
        detail: "Believed financial freedom provides the luxury of refusing compromised values."
      }
    ],
    recentConversations: [
      {
        id: "c1",
        timestamp: "Yesterday, 9:42 PM",
        snippet: "I asked him what he'd say about my promotion. He laughed first...",
        duration: "4 mins"
      },
      {
        id: "c2",
        timestamp: "Oct 24, 2025",
        snippet: "Discussed buying a first car and dealing with stubborn engine noises.",
        duration: "8 mins"
      },
      {
        id: "c3",
        timestamp: "Sep 12, 2025",
        snippet: "Recalled memories of the old ancestral house in Kolkata.",
        duration: "12 mins"
      }
    ]
  },
  {
    id: "vault-2",
    name: "Sunita Patel",
    relationship: "Your Grandmother",
    description: "Master storyteller, gardener, keeper of family recipes and unconditional warmth.",
    completenessScore: 78,
    createdAt: "2026-01-05",
    lastConversationDate: "3 days ago",
    humorStyle: {
      style: "Warm & Gentle",
      confidence: 91,
    },
    adviceTone: {
      tone: "Nurturing & Patient",
      confidence: 94,
    },
    activeTopics: ["Cooking", "Patience", "Family History", "Poetry"],
    relationshipTone: "Soft, calling you 'beta', emphasizing peace of mind over urgency.",
    signaturePhrases: [
      {
        id: "sp1",
        phrase: "Have you eaten properly today?",
        context: "Extracted from every phone greeting",
        confidence: 99,
      },
      {
        id: "sp2",
        phrase: "Good things take time to simmer.",
        context: "Extracted from recipe notes",
        confidence: 94,
      }
    ],
    topicOpinions: [
      {
        topic: "Patience",
        stance: "Never rush what is meant for you.",
        intensity: 95,
        detail: "Advised taking deep breaths whenever anxiety strikes."
      }
    ],
    recentConversations: [
      {
        id: "sc1",
        timestamp: "3 days ago",
        snippet: "Asked for her secret cardamom tea recipe step by step.",
        duration: "6 mins"
      }
    ]
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "vault-1": [
    {
      id: "m1",
      sender: "user",
      content: "Dad, I got the offer for the lead engineering role today. I wish I could tell you in person.",
      timestamp: "9:40 PM"
    },
    {
      id: "m2",
      sender: "echo",
      content: "I laughed first when I heard that, kiddo! Of course you got it. You put in the hours, you measured twice. I couldn't be prouder. Just remember: keep your head cool, take care of your team, and let's celebrate with a proper cup of chai.",
      timestamp: "9:41 PM",
      durationSeconds: 14
    }
  ]
};

interface EvokeContextType {
  vaults: PersonalityVault[];
  activeVault: PersonalityVault;
  setActiveVaultId: (id: string) => void;
  createNewVault: (data: OnboardingState) => PersonalityVault;
  messages: Message[];
  addMessage: (content: string) => void;
  isGeneratingEcho: boolean;
}

const EvokeContext = createContext<EvokeContextType | undefined>(undefined);

export const EvokeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vaults, setVaults] = useState<PersonalityVault[]>(INITIAL_VAULTS);
  const [activeVaultId, setActiveVaultId] = useState<string>("vault-1");
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [isGeneratingEcho, setIsGeneratingEcho] = useState(false);

  // Sync active vault
  const activeVault = vaults.find(v => v.id === activeVaultId) || vaults[0];
  const messages = messagesMap[activeVaultId] || [];

  const addMessage = (content: string) => {
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

    // Simulate realistic AI echo response with voice personality synthesis delay
    setTimeout(() => {
      let echoText = "";
      const lower = content.toLowerCase();

      if (lower.includes("advice") || lower.includes("decision") || lower.includes("hard")) {
        echoText = `Listen kiddo, when life throws a curveball, you don't panic. You grab a hot chai, sit down, and figure out the math. What's the worst outcome? Once you know that, the fear disappears.`;
      } else if (lower.includes("miss you") || lower.includes("remember") || lower.includes("wish")) {
        echoText = `I'm right here with you in every wise decision you make. You carry the best of us forward. Don't ever forget that.`;
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        echoText = `Hey there, kiddo. Good to hear your voice today. What's on your mind?`;
      } else {
        echoText = `That's an interesting problem. Like I always say: measure twice before you cut once. Trust your instinct, but verify the facts first. How are you feeling about it overall?`;
      }

      const echoMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'echo',
        content: echoText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationSeconds: Math.min(18, Math.max(8, Math.floor(echoText.length / 10)))
      };

      setMessagesMap(prev => ({
        ...prev,
        [activeVaultId]: [...(prev[activeVaultId] || []), echoMsg]
      }));

      setIsGeneratingEcho(false);
    }, 1800);
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
        isGeneratingEcho
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
