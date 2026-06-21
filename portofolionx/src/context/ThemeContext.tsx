import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { dark, light, type ColorPalette } from '../lib/colors';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  c: ColorPalette;
  restartKey: number;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [restartKey, setRestartKey] = useState(0);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const c = theme === 'dark' ? dark : light;

  useEffect(() => {
    const id = setInterval(() => setRestartKey(k => k + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, c, restartKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
