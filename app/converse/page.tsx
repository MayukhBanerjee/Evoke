import React from 'react';
import { ConversationUI } from '@/components/converse/ConversationUI';

export default function ConversePage() {
  return (
    <main className="h-screen bg-evoke-bg text-evoke-text-primary overflow-hidden transition-colors duration-300">
      <ConversationUI />
    </main>
  );
}
