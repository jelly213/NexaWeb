import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import HowItWorks from './sections/HowItWorks';
import TechStack from './sections/TechStack';
import FinalCTA from './sections/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <Hero />
        <Problem />
        <HowItWorks />
        <TechStack />
        <FinalCTA />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;