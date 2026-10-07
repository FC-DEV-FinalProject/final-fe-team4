import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{html,js,jsx,ts,tsx}',
    './src/pages/**/*.{html,js,jsx,ts,tsx}',
    './src/layouts/**/*.{html,js,jsx,ts,tsx}',
    './src/routes/**/*.{html,js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    container: {
      center: 'true',
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Pretendard', ...fontFamily.sans],
        pretendard: ['Pretendard', 'sans-serif'],
      },
      fontSize: {
        h1: ['40px', { lineHeight: '48px', fontWeight: '700' }],
        h2: ['27px', { lineHeight: '35px', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '36px', fontWeight: '700' }],
        h4: ['20px', { lineHeight: '28px', fontWeight: '700' }],
        body1: ['17px', { lineHeight: '24px', fontWeight: '600' }],
        body2: ['16px', { lineHeight: '24px', fontWeight: '500' }],
        body3: ['14px', { lineHeight: '20px', fontWeight: '700' }],
        body4: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        overline: ['12px', { lineHeight: '18px', fontWeight: '500' }],
        tiny: ['11px', { lineHeight: '16px', fontWeight: '500' }],
      },
      colors: {
        white: '#FFFFFF',
        black: '#1B1B1B',
        green: {
          50: '#E0FFE9',
          500: '#22C55E',
        },
        yellow: {
          50: '#FFFBCC',
          500: '#FBBC05',
        },
        blue: {
          50: '#edf1ff',
          100: '#c2d4ff',
          200: '#a4bfff',
          300: '#7ba2fe',
          400: '#6190fe',
          500: '#3a74fe',
          600: '#356ae7',
          700: '#2952b4',
          800: '#20408c',
          900: '#18316b',
        },
        gray: {
          50: '#f7f7f7',
          100: '#e4e4e4',
          200: '#d7d7d7',
          300: '#c4c4c4',
          400: '#b9b9b9',
          500: '#a7a7a7',
          600: '#989898',
          700: '#777777',
          800: '#5C5C5C',
          900: '#1b1b1b',
        },
        red: {
          50: '#fdecec',
          100: '#ffdbdb',
          200: '#f8a9a9',
          300: '#f48282',
          400: '#f26969',
          500: '#df4444',
          600: '#d93e3e',
          700: '#aa3030',
          800: '#832525',
          900: '#641d1d',
        },
        purple: {
          50: '#FAF7FF',
          500: '#9261E1',
        },
        pink: {
          50: '#FFE9FB',
          500: '#F187DD',
        },
        background: '#FFFFFF',
        foreground: '#020617',
        border: '#C4C4C4',
        input: '#C4C4C4',
        ring: '#020617',
        primary: {
          DEFAULT: '#3a74fe',
          foreground: '#f8fafc',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#1e293b',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#1e293b',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#020617',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#020617',
        },
        chart: {
          1: '#f97316',
          2: '#2a9d8f',
          3: '#1a374d',
          4: '#eab308',
          5: '#fb923c',
        },
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      spacing: {
        0.75: '3px',
        4.5: '18px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
