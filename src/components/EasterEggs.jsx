import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useI18n } from '@/i18n/context';

/*
 * Keyboard easter eggs, site-wide:
 *   ↑ ↑ ↓ ↓ ← → ← → B A   toggles CRT mode (`html.crt`, styled in index.css), remembered per browser
 *   typing "sudo join"     grants access and scrolls to the home page's #join section
 * Keys typed into form fields never count. Letters are read from the physical key
 * (KeyboardEvent.code), so both work with an Arabic keyboard layout too.
 */
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
const SUDO_JOIN = 'sudo join';
const CRT_KEY = 'ies-crt';

/* The pixel font is only fetched once someone actually turns CRT mode on. */
function loadCrtFont() {
  if (document.getElementById('crt-font')) return;
  const link = document.createElement('link');
  link.id = 'crt-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
  document.head.appendChild(link);
}

/* 'KeyB' -> 'b', 'Space' -> ' ', arrows stay 'arrowup' etc. */
function keyName(e) {
  if (e.code?.startsWith('Key')) return e.code.slice(3).toLowerCase();
  if (e.code === 'Space') return ' ';
  return e.key.toLowerCase();
}

function isTyping(target) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export default function EasterEggs({ lenisRef }) {
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(0);
  const { t } = useI18n();

  useEffect(() => {
    try {
      if (localStorage.getItem(CRT_KEY) === '1') {
        loadCrtFont();
        document.documentElement.classList.add('crt');
      }
    } catch {
      /* storage blocked — CRT mode just won't persist */
    }

    const say = (text) => {
      clearTimeout(toastTimer.current);
      setToast({ text, id: Date.now() });
      toastTimer.current = setTimeout(() => setToast(null), 2800);
    };

    let keys = [];
    let typed = '';

    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      const key = keyName(e);

      keys = [...keys, key].slice(-KONAMI.length);
      if (keys.join() === KONAMI.join()) {
        keys = [];
        loadCrtFont();
        const on = document.documentElement.classList.toggle('crt');
        try {
          localStorage.setItem(CRT_KEY, on ? '1' : '0');
        } catch {
          /* ignore */
        }
        say(t(on ? 'eggs.crtOn' : 'eggs.crtOff'));
        return;
      }

      if (key.length !== 1) return;
      typed = (typed + key).slice(-SUDO_JOIN.length);
      if (typed !== SUDO_JOIN) return;
      typed = '';

      const join = document.getElementById('join');
      if (!join) {
        say(t('eggs.sudoElsewhere'));
        return;
      }
      say(t('eggs.sudoGranted'));
      const flash = () => gsap.fromTo('.join-btn', { scale: 1.12 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', repeat: 2 });
      if (lenisRef.current) lenisRef.current.scrollTo(join, { duration: 1.4, onComplete: flash });
      else {
        join.scrollIntoView({ behavior: 'smooth' });
        flash();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(toastTimer.current);
    };
  }, [lenisRef, t]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      role="status"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#0e0e0e] border border-[#F57C00]/60 px-4 py-2 font-mono text-[13px] text-[#F57C00] shadow-[0_0_20px_rgba(245,124,0,0.25)] animate-in fade-in slide-in-from-bottom-2 duration-300 whitespace-nowrap max-w-[calc(100vw-32px)] overflow-hidden text-ellipsis"
    >
      <span className="text-[#1E88E5]">{'> '}</span>
      {toast.text}
    </div>
  );
}
