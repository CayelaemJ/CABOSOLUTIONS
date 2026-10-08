import { Nav } from './components/Nav';
import { NfcProfile } from './components/NfcProfile';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Founders } from './components/Founders';
import { HeritageBand } from './components/HeritageBand';
import { Process } from './components/Process';
import { Pricing } from './components/Pricing';
import { Portfolio } from './components/Portfolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const path = window.location.pathname.replace(/\\/$/, '').toLowerCase();
  if (path.startsWith('/nfc/')) return <NfcProfile slug={path.split('/')[2] || ''} />;
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cabo-bg)' }}>
      <Nav />
      <Hero />
      <Services />
      <Portfolio />
      <Founders />
      <HeritageBand />
      <Process />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}