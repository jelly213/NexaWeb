import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import HowItWorks from './sections/HowItWorks';
import TechStack from './sections/TechStack';
import FinalCTA from './sections/FinalCTA';
import Footer from './components/Footer';

function AppInner() {
  const { c } = useTheme();
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <TechStack />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
