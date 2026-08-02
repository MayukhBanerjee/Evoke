"use client";

import React from 'react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Cpu, Globe, Cloud } from 'lucide-react';

const AWS_SERVICES = [
  { name: "Amazon S3", desc: "Encrypted storage for raw audio recordings, voice samples, and text documents." },
  { name: "AWS Lambda", desc: "Serverless execution for personality schema extraction and audio processing." },
  { name: "Amazon Transcribe", desc: "Automatic speech recognition converting spoken memories into structured text." },
  { name: "Amazon Comprehend", desc: "Natural language processing detecting sentiment, key phrases, and emotional tone." },
  { name: "Amazon DynamoDB", desc: "NoSQL database holding user vaults and structured topic stance records." },
  { name: "Amazon Cognito", desc: "Consent-first authentication and fine-grained family authorization." },
  { name: "AWS Amplify", desc: "Global edge deployment and CI/CD hosting for Next.js web app." }
];

const EXTERNAL_APIS = [
  { name: "Groq LLM Engine", desc: "Ultra-low latency Llama-3 70B inference for real-time conversational echoes." },
  { name: "ElevenLabs Voice API", desc: "Neural voice cloning and emotional speech synthesis." },
  { name: "Web Audio API", desc: "In-browser live waveform visualization and audio frequency analysis." },
  { name: "Next.js 14 App Router", desc: "React server components with optimized client hydration." },
  { name: "Framer Motion", desc: "Subtle 200ms page micro-animations and smooth transition flows." }
];

export const TechStack: React.FC = () => {
  return (
    <section id="tech-stack" className="py-24 relative z-10 border-t border-evoke-border bg-evoke-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#FF9A3C] font-semibold mb-3 flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4 text-[#FF9A3C]" />
            Enterprise Architecture
          </h2>
          <h3 className="font-syne text-3xl sm:text-4xl font-bold text-evoke-text-primary">
            Built on infrastructure that never sleeps.
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AWS Column */}
          <Card className="p-8 border-[#FF9A3C]/20 hover:border-[#FF9A3C]/40 bg-evoke-card" hoverEffect={true}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-evoke-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#FF9A3C]/10 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-[#FF9A3C]" />
                </div>
                <div>
                  <h4 className="font-syne text-lg font-bold text-evoke-text-primary">AWS Serverless Infrastructure</h4>
                  <p className="text-xs text-evoke-text-secondary">Zero idle cost · Scalable to millions</p>
                </div>
              </div>
              <Badge variant="aws">AWS Cloud</Badge>
            </div>

            <div className="space-y-4">
              {AWS_SERVICES.map((item) => (
                <div key={item.name} className="p-3.5 rounded-[10px] bg-evoke-surface border border-evoke-border flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-evoke-text-primary font-mono">{item.name}</span>
                    <Badge variant="aws" className="text-[9px] px-2 py-0.5">Cloud Service</Badge>
                  </div>
                  <p className="text-xs text-evoke-text-secondary font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* External & AI Column */}
          <Card 
            className="p-8 border-[#C5A880]/20 hover:border-[#C5A880]/40 bg-evoke-card" 
            hoverEffect={true}
            borderTheme="gold"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-evoke-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#C5A880]/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#C5A880]" />
                </div>
                <div>
                  <h4 className="font-syne text-lg font-bold text-evoke-text-primary">AI & Frontend Stack</h4>
                  <p className="text-xs text-evoke-text-secondary">Real-time synthesis & UI performance</p>
                </div>
              </div>
              <Badge variant="gold">AI Engine</Badge>
            </div>

            <div className="space-y-4">
              {EXTERNAL_APIS.map((item) => (
                <div key={item.name} className="p-3.5 rounded-[10px] bg-evoke-surface border border-evoke-border flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-evoke-text-primary font-mono">{item.name}</span>
                    <Badge variant="gold" className="text-[9px] px-2 py-0.5">Integrations</Badge>
                  </div>
                  <p className="text-xs text-evoke-text-secondary font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
