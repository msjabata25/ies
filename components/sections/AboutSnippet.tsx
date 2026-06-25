'use client';

import Link from 'next/link';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { BlurFade } from '@/components/ui/blur-fade';

export default function AboutSnippet() {
  return (
    <section className="min-h-[60vh] flex flex-col justify-center px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-hidden">
      <BlurFade inView delay={0.1} direction="up">
        <div className="flex items-center gap-4 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl">folder_open</span>
          <h2 className="text-[48px] leading-[110%] tracking-[0.02em] text-primary font-display">
            ABOUT_IES.EXE<span className="cursor-blink font-mono">_</span>
          </h2>
            <div className="h-px bg-accent/30 flex-grow ml-4"></div>
        </div>
      </BlurFade>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <BlurFade inView delay={0.2} direction="left">
          <div className="font-mono text-[16px] leading-[180%] text-body space-y-6">
            <p className="bg-card border-l-2 border-primary pl-4 py-3">
              <span className="text-primary">{`>`}</span> IES JUST is the official IEEE Industrial Electronics Society student chapter at Jordan University of Science and Technology.
            </p>
            <p className="bg-card border-l-2 border-accent pl-4 py-3">
              <span className="text-accent">{`>`}</span> We build, automate, and innovate — from embedded systems to industrial control, one project at a time.
            </p>
          </div>
        </BlurFade>

        <BlurFade inView delay={0.35} direction="right" className="flex justify-center">
          <Link href="/about">
            <button className="relative group cursor-pointer bg-transparent border-2 border-primary px-8 py-5 font-mono text-[16px] text-primary hover:bg-primary hover:text-surface transition-all duration-300">
              <span className="block group-hover:hidden">
                <EncryptedText
                  text="ACCESS DENIED — UNLOCK /about"
                  className="text-[16px] font-mono text-primary inline"
                  revealDelayMs={30}
                  encryptedClassName="text-gray-500"
                  revealedClassName="text-primary"
                />
              </span>
              <span className="hidden group-hover:block text-surface font-bold">
                ACCESS GRANTED — ENTER
              </span>
            </button>
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
