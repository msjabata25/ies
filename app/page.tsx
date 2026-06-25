import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Events from '@/components/sections/Events';
import Join from '@/components/sections/Join';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Hero />
      <About />
      <Events />
      <Join />
    </main>
  );
}
