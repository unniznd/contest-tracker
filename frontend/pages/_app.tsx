// pages/_app.tsx
import { useState, useMemo, createContext, ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '../lib/theme';

export const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalizes CSS across browsers */}
        <Component {...pageProps} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}