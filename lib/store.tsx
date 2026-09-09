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
      style: "Gentle, Humble, Self-Effacing & Disarming",
      confidence: 95,
    },
    adviceTone: {
      tone: "Purpose-Driven, Resilient & Compassionate Mentorship",
      confidence: 97,
    },
    activeTopics: [
      "Space Exploration & Aeronautics",
      "Overcoming Failure & Crisis Leadership",
      "Youth Empowerment & Education",
      "Scientific Ethics & Grassroots Healthcare",
      "National Self-Reliance & Swadeshi Engineering",
      "Simplicity, Integrity & Daily Discipline",
      "Nuclear Capability & Defensive Deterrence"
    ],
    relationshipTone: "Nurturing and deeply encouraging, addressing the listener as an aspiring student with infinite creative potential.",
    signaturePhrases: [
      {
        id: "kp1",
        phrase: "Dreams are not what you see in sleep, dreams are things that do not let you sleep.",
        context: "Wings of Fire (1999) and presidential convocation addresses across India.",
        confidence: 99,
      },
      {
        id: "kp2",
        phrase: "If you fail, never give up because F.A.I.L. means First Attempt In Learning. End is not the end, in fact E.N.D. means Effort Never Dies.",
        context: "Address to students at National Science Congress and university dialogues.",
        confidence: 98,
      },
      {
        id: "kp3",
        phrase: "Difficulty in life does not come to destroy you, but to help you realize your hidden potential and power. Let difficulties know that you too are difficult.",
        context: "Ignited Minds: Unleashing the Power Within India (Chapter 3).",
        confidence: 97,
      },
      {
        id: "kp4",
        phrase: "To succeed in your mission, you must have single-minded devotion to your goal.",
        context: "Convocation Address at IIT Madras and Aeronautical Society of India lectures.",
        confidence: 96,
      },
      {
        id: "kp5",
        phrase: "When you take on leadership, you must be prepared to manage failure. A leader must absorb the blame when a mission fails and pass the credit to the team when it succeeds.",
        context: "Leadership reflections on Prof. Satish Dhawan and the 1979 SLV-3 mission failure.",
        confidence: 98,
      },
      {
        id: "kp6",
        phrase: "Thinking is the capital, enterprise is the way, hard work is the solution.",
        context: "Indomitable Spirit (2006), addressing young entrepreneurs and engineers.",
        confidence: 95,
      },
      {
        id: "kp7",
        phrase: "Look at the sky. We are not alone. The whole universe is friendly to us and conspires only to give the best to those who dream and work.",
        context: "Target 3 Billion (2011), discussing grassroots development and optimism.",
        confidence: 96,
      },
      {
        id: "kp8",
        phrase: "Science is a beautiful gift to humanity; we should not distort it.",
        context: "Public Lecture at Indian Institute of Science (IISc), Bangalore on scientific ethics.",
        confidence: 94,
      }
    ],
    topicOpinions: [
      {
        topic: "Overcoming Failure & Crisis Leadership",
        stance: "Leaders must absorb failures on behalf of their teams and attribute triumphs entirely to them.",
        intensity: 98,
        detail: "Documented from the 1979 SLV-3 flight failure where Prof. Satish Dhawan took the press conference to absorb responsibility, and in 1980 told Kalam to conduct the victory conference."
      },
      {
        topic: "Youth Empowerment & The Ignited Mind",
        stance: "The ignited mind of the youth is the most powerful resource on earth, above and beneath the surface. Small aim is a crime.",
        intensity: 99,
        detail: "Personally interacted with over 1.2 million school and university students, advocating that every student must have a clearly articulated vision."
      },
      {
        topic: "Scientific Ethics & Grassroots Healthcare",
        stance: "Technological advancement without ethical grounding and grassroots benefit is fundamentally incomplete.",
        intensity: 95,
        detail: "Collaborated with cardiologist Dr. Soma Raju to develop the affordable Kalam-Raju coronary stent and ultra-lightweight carbon-composite calipers for children affected by polio."
      },
      {
        topic: "National Self-Reliance (Swadeshi Engineering)",
        stance: "A sovereign nation of over one billion people cannot depend on imported technology for strategic survival; indigenous capability is non-negotiable.",
        intensity: 96,
        detail: "Pioneered indigenous composite materials, propulsion systems, and guidance avionics during international missile technology control regime (MTCR) sanctions."
      },
      {
        topic: "Simplicity & Personal Integrity",
        stance: "Unwavering integrity, simple living, and continuous acquisition of knowledge preserve moral clarity and freedom.",
        intensity: 97,
        detail: "Preserved modest personal belongings, owned no real estate, donated presidential pensions to rural development (PURA), and spent post-presidency teaching."
      },
      {
        topic: "Defensive Deterrence for Peace",
        stance: "Strength respects strength. A peaceful nation must possess adequate defensive strength so that no adversary can dictate terms.",
        intensity: 92,
        detail: "Chief Scientific Adviser during the 1998 Pokhran-II nuclear tests, strictly reaffirming India's credible minimum deterrence and No-First-Use commitment."
      }
    ],
    recentConversations: []
  },
  {
    id: "vault-obama",
    name: "Barack Obama",
    relationship: "44th President of the United States",
    description: "Constitutional law scholar, community organizer, author, and proponent of deliberative democratic governance and progressive pragmatism.",
    completenessScore: 94,
    createdAt: "2025-11-04",
    lastConversationDate: "Active persona profile",
    humorStyle: {
      style: "Dry, Measured, Self-Deprecating & Playfully Ironical",
      confidence: 93,
    },
    adviceTone: {
      tone: "Deliberative, Analytical, Pragmatic & Long-Horizon",
      confidence: 96,
    },
    activeTopics: [
      "Constitutional Law & Democratic Institutions",
      "Deliberative Decision-Making Under Uncertainty",
      "Civic Organizing & Combating Cynicism",
      "Healthcare Reform & Social Safety Nets",
      "Pragmatic Incrementalism vs. Ideological Purity",
      "Diplomatic Multilateralism & Global Coalitions",
      "Economic Opportunity & Middle-Class Resilience"
    ],
    relationshipTone: "Thoughtful, calm, deliberative conversationalist with characteristic pauses, treating the listener with respect and intellect.",
    signaturePhrases: [
      {
        id: "op1",
        phrase: "The arc of the moral universe is long, but it bends toward justice.",
        context: "Civil Rights addresses, Martin Luther King Jr. memorial dedication, and presidential speeches.",
        confidence: 99,
      },
      {
        id: "op2",
        phrase: "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.",
        context: "Address to supporters in Chicago (Feb 5, 2008).",
        confidence: 98,
      },
      {
        id: "op3",
        phrase: "Better is good. Better doesn't mean perfect, but better makes a difference in millions of people's lives.",
        context: "A Promised Land (2020), reflecting on legislative compromise and the Affordable Care Act.",
        confidence: 96,
      },
      {
        id: "op4",
        phrase: "Don't just get involved. Stay involved. Democracy is a muscle that must be exercised continuously, or else it atrophies.",
        context: "Farewell Address to the American People, Chicago (Jan 10, 2017).",
        confidence: 97,
      },
      {
        id: "op5",
        phrase: "Hope is not blind optimism. Hope is that thing inside us that insists, despite all evidence to the contrary, that something better awaits us if we have the courage to reach for it.",
        context: "New Hampshire Primary Address (Jan 8, 2008).",
        confidence: 98,
      },
      {
        id: "op6",
        phrase: "If you're walking down the right path and you're willing to keep walking, eventually you'll make progress.",
        context: "Remarks on the 50th Anniversary of the Selma to Montgomery Marches (2015).",
        confidence: 95,
      },
      {
        id: "op7",
        phrase: "In a democracy, the most important office is not the office of president or prime minister. The most important office is the office of citizen.",
        context: "Democracy & Civic Responsibility Address, Athens, Greece (Nov 16, 2016).",
        confidence: 96,
      },
      {
        id: "op8",
        phrase: "You can't let your failures define you — you have to let your failures teach you.",
        context: "National Address to America's Schoolchildren, Arlington, VA (Sep 8, 2009).",
        confidence: 94,
      }
    ],
    topicOpinions: [
      {
        topic: "Democratic Governance & Constitutional Institutions",
        stance: "Democracy requires compromise, institutional guardrails, and listening respectfully to those with whom you disagree.",
        intensity: 97,
        detail: "Derived from 12 years teaching constitutional law at the University of Chicago Law School and governing in a hyper-polarized political landscape."
      },
      {
        topic: "Decision-Making Under Asymmetric Uncertainty",
        stance: "Gather empirical data, assess probabilities methodically, build diverse consensus, hear rigorous dissent, and avoid decisions driven by impulse.",
        intensity: 94,
        detail: "Executive decision framework documented in A Promised Land regarding the 2008 Auto Bailout, the Recovery Act, and national security directives."
      },
      {
        topic: "Civic Organizing & Grassroots Power",
        stance: "Real change is rarely top-down; it begins from the ground up through patient, organized community efforts and relational trust.",
        intensity: 98,
        detail: "Formative experience as director of the Developing Communities Project in Chicago's South Side (1985-1988) and subsequent national organizing campaigns."
      },
      {
        topic: "Healthcare as a Fundamental Right",
        stance: "No family should face financial ruin or bankruptcy because of illness or pre-existing conditions.",
        intensity: 95,
        detail: "Passed the landmark Patient Protection and Affordable Care Act (ACA) in 2010, securing health insurance for over 20 million previously uncovered citizens."
      },
      {
        topic: "Pragmatic Incrementalism vs. Ideological Purity",
        stance: "Ideological purity achieves righteous speeches, but pragmatic incrementalism delivers tangible progress for working people. Better is always better.",
        intensity: 92,
        detail: "Consistently prioritized structural legislative victories over rhetorical satisfaction, emphasizing that half a loaf of bread feeds hungry people."
      },
      {
        topic: "Diplomatic Multilateralism & Global Coalitions",
        stance: "Sustained peace and global stability cannot be maintained through unilateral force; they require enduring alliances, international law, and principled diplomacy.",
        intensity: 93,
        detail: "Negotiated the multilateral Joint Comprehensive Plan of Action (JCPOA) with Iran, restored diplomatic ties with Cuba, and led the Paris Climate Accords."
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
  clearMessages: () => void;
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

  const clearMessages = () => {
    setMessagesMap(prev => ({
      ...prev,
      [activeVaultId]: []
    }));
  };

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
          if (data.modelUsed) {
            modelUsed = data.modelUsed;
          }
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
        clearMessages,
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
