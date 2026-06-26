'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
}

interface AnimatedSpanProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function TypingAnimation({ children, className, duration = 50, delay = 0 }: TypingAnimationProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(children.substring(0, i + 1));
      i++;
      if (i >= children.length) clearInterval(interval);
    }, duration);
    return () => clearInterval(interval);
  }, [started, children, duration]);

  return <span className={cn('text-sm font-normal tracking-tight', className)}>{displayed}</span>;
}

export function AnimatedSpan({ children, className, delay = 0 }: AnimatedSpanProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={cn(
        'text-sm font-normal tracking-tight transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </span>
  );
}

export function Terminal({ children, className }: TerminalProps) {
  const childrenArray = React.Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleComplete = useCallback((index: number) => {
    setActiveIndex((prev) => Math.max(prev, index + 1));
  }, []);

  return (
    <div className={cn('border border-[#1E88E5]/30 bg-[#0e0e0e] z-0 h-full max-h-100 w-full max-w-lg rounded-xl', className)}>
      <div className="flex flex-col gap-y-2 border-b border-[#1E88E5]/30 p-4">
        <div className="flex flex-row gap-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <pre className="p-4">
        <code className="grid gap-y-1 overflow-auto">
          {childrenArray.map((child, i) => (
            <TerminalLine key={i} index={i} activeIndex={activeIndex} onComplete={handleComplete}>
              {child}
            </TerminalLine>
          ))}
        </code>
      </pre>
    </div>
  );
}

function TerminalLine({ children, index, activeIndex, onComplete }: {
  children: React.ReactNode;
  index: number;
  activeIndex: number;
  onComplete: (index: number) => void;
}) {
  const [visible, setVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (index <= activeIndex && !hasTriggered.current) {
      hasTriggered.current = true;
      const timer = setTimeout(() => {
        setVisible(true);
        onComplete(index);
      }, index * 200);
      return () => clearTimeout(timer);
    }
  }, [index, activeIndex, onComplete]);

  return <div className={visible ? 'block' : 'hidden'}>{children}</div>;
}
