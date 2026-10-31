import { useEffect, useMemo, useState } from 'react';
import { I18nContext, LANG_KEY, applyLanguage, detectLanguage, makeI18n } from './context';

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage);

  useEffect(() => {
    applyLanguage(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value = useMemo(() => makeI18n(lang, setLang), [lang]);
  return <I18nContext value={value}>{children}</I18nContext>;
}
