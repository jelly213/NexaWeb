import { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Footer from './components/Footer';

const Problem = lazy(() => import('./sections/Problem'));
const HowItWorks = lazy(() => import('./sections/HowItWorks'));
const TechStack = lazy(() => import('./sections/TechStack'));
const FinalCTA = lazy(() => import('./sections/FinalCTA'));

function AppInner() {
  const { c } = useTheme();
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Problem />
          <HowItWorks />
          <TechStack />
          <FinalCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <LazyMotion features={domAnimation}>
          <AppInner />
        </LazyMotion>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
