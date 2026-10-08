import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Founders } from './components/Founders';
import { HeritageBand } from './components/HeritageBand';
import { Process } from './components/Process';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cabo-bg)' }}>
      <Nav />
      <Hero />
      <Services />
      <Founders />
      <HeritageBand />
      <Process />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}