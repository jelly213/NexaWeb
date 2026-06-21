import { useTheme } from '../context/ThemeContext';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';

export default function Hero() {
  const { c } = useTheme();
  return (
    <section id="hero" className="pt-[65px]" style={{ backgroundColor: c.bg }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-2" style={{ borderBottom: `1px solid ${c.border}` }}>
          <div style={{ borderRight: `1px solid ${c.border}` }}>
            <HeroContent />
          </div>
          <HeroImage />
        </div>
      </div>
    </section>
  );
}
