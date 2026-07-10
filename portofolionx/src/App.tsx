import { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ConsentProvider } from './context/ConsentContext';
import ConsentBanner from './components/ConsentBanner';
import PageAnalytics from './components/PageAnalytics';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Footer from './components/Footer';

const Problem = lazy(() => import('./sections/Problem'));
const HowItWorks = lazy(() => import('./sections/HowItWorks'));
const TechStack = lazy(() => import('./sections/TechStack'));
const Pricing = lazy(() => import('./sections/Pricing'));
const FinalCTA = lazy(() => import('./sections/FinalCTA'));

function AppInner() {
  const { c } = useTheme();
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <PageAnalytics />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Problem />
          <HowItWorks />
          <TechStack />
          <Pricing />
          <FinalCTA />
        </Suspense>
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ConsentProvider>
          <LazyMotion features={domAnimation}>
            <AppInner />
          </LazyMotion>
        </ConsentProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
