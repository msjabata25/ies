import Hero from '@/components/sections/Hero';
import AboutSnippet from '@/components/sections/AboutSnippet';
import StatsTicker from '@/components/sections/StatsTicker';
import EventsPreview from '@/components/sections/EventsPreview';
import TeamPreview from '@/components/sections/TeamPreview';
import Join from '@/components/sections/Join';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Hero />
      <AboutSnippet />
      <StatsTicker />
      <EventsPreview />
      <TeamPreview />
      <Join />
    </main>
  );
}
