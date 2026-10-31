import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import LanguageProvider from '@/i18n/LanguageProvider';

// Each page is loaded only when visited (Next.js did this automatically).
// This keeps three.js, which only the Events page uses, off the home page.
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Events = lazy(() => import('@/pages/Events'));
const Team = lazy(() => import('@/pages/Team'));
const Apply = lazy(() => import('@/pages/Apply'));

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/team" element={<Team />} />
              <Route path="/apply" element={<Apply />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}
