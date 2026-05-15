import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Events from '../components/sections/Events';
import Join from '../components/sections/Join';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Events />
      <Join />
      <Footer />
    </main>
  );
}
