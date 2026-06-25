'use client';

import { Terminal, TypingAnimation, AnimatedSpan } from '@/components/ui/terminal';

export default function EventsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Terminal className="max-w-2xl w-full bg-[#0e0e0e] border-[#1E88E5]/30">
        <TypingAnimation duration={50}>C:\&gt; LOADING MODULE_EVENTS...</TypingAnimation>
        <AnimatedSpan className="text-[#1E88E5]">INITIALIZING_EVENTS_SECTION [PENDING]</AnimatedSpan>
        <AnimatedSpan className="text-gray-500">STATUS: MODULE_UNDER_CONSTRUCTION</AnimatedSpan>
        <TypingAnimation duration={40} className="text-[#F57C00]">[OK] STUB_READY. FULL_CONTENT_IN_PHASE_2.</TypingAnimation>
      </Terminal>
    </main>
  );
}
