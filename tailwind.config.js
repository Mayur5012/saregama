/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        
        gridTemplateRows: {
          '[auto,auto,1fr]': 'auto auto 1fr',
        },
        colors: {
          cyberpurple: '#8e44ad',
          cyberpink: "#ff79c6", 
          primary: {
            "50": "#eff6ff",
            "100": "#dbeafe",
            "200": "#bfdbfe",
            "300": "#93c5fd",
            "400": "#60a5fa",
            "500": "#3b82f6",
            "600": "#2563eb",
            "700": "#1d4ed8",
            "800": "#1e40af",
            "900": "#1e3a8a",
            "950": "#172554",
          },
        },
        backdropBlur: {
          xs: '2px',
          sm: '4px',
        },
      },
      fontFamily: {
        premium: ['Cinzel', 'serif'],
        body: [
          'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans',
          'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol', 'Noto Color Emoji',
        ],
        sans: [
          'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans',
          'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol', 'Noto Color Emoji',
        ],
      },
    },
    variants: {
      extend: {
        animation: ['hover', 'group-hover'],
        transform: ['hover', 'group-hover']
      }
    },
    plugins: [require('@tailwindcss/aspect-ratio')],
  };
  