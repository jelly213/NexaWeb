import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { dark, light, type ColorPalette } from '../lib/colors';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  c: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const c = theme === 'dark' ? dark : light;

  // The page background must follow the theme outside the React tree too:
  // overscroll rubber-banding and any horizontal overflow expose html/body,
  // which index.css paints dark — a black band in light mode otherwise.
  useEffect(() => {
    document.documentElement.style.backgroundColor = c.bg;
    document.body.style.backgroundColor = c.bg;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', c.navBg);
  }, [c]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, c }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
