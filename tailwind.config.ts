import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          dark: 'var(--color-primary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        border: 'var(--color-border)',
        tag: 'var(--color-tag)',
        'tag-border': 'var(--color-tag-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        tag: 'var(--radius-tag)',
      },
    },
  },
  plugins: [],
};

export default config;
