/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F0FDF4',
          green: '#22C55E',
          lime: '#84CC16',
          navy: '#0F172A',
          orange: '#F97316',
          softGreen: '#DCFCE7',
          softOrange: '#FFF7ED',
        },
      },
      boxShadow: {
        soft: '0 2px 16px 0 rgba(15,23,42,0.06)',
        lift: '0 8px 32px 0 rgba(15,23,42,0.14)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        pop: { '0%': { transform: 'scale(0.92)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
