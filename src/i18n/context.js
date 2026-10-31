import { createContext, useContext } from 'react';
import en from './en';
import ar from './ar';

/*
 * Tiny i18n layer: English and Jordanian Arabic dictionaries, keyed by dotted
 * paths (`t('apply.labels.email')`). Strings can hold `{name}` placeholders;
 * arrays and objects come back as-is. A key missing from Arabic falls back to
 * English, so a half-translated string never shows up blank.
 *
 * Choosing Arabic sets <html lang="ar" dir="rtl">; layouts should use logical
 * Tailwind classes (ms-/ps-/start-/text-start) so they flip on their own.
 */
export const LANGS = { en, ar };
export const LANG_KEY = 'ies-lang';

export function detectLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    /* storage blocked — fall through to the browser language */
  }
  return (navigator.languages ?? [navigator.language]).some((l) => l?.toLowerCase().startsWith('ar')) ? 'ar' : 'en';
}

/* Applied before React renders (main.jsx) and on every switch, so the page never flashes the wrong direction. */
export function applyLanguage(lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = lookup(LANGS[lang], 'meta.title') ?? lookup(en, 'meta.title');
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

export function makeI18n(lang, setLang) {
  const t = (key, vars) => {
    const value = lookup(LANGS[lang], key) ?? lookup(en, key);
    if (value == null) return key;
    if (typeof value !== 'string' || !vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  };
  return {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    isArabic: lang === 'ar',
    t,
    setLang,
    toggleLang: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
    /* Pick the Arabic copy of a data item's field when there is one. */
    pick: (item, field) => (lang === 'ar' && item.ar?.[field]) || item[field],
  };
}

export const I18nContext = createContext(makeI18n('en', () => {}));

export function useI18n() {
  return useContext(I18nContext);
}
