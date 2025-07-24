export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'rotateX(10deg) rotateY(-5deg) scale(1)' },
          '50%': { transform: 'rotateX(10deg) rotateY(-5deg) scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'rotateX(10deg) rotateY(-5deg) translateY(0)' },
          '50%': { transform: 'rotateX(10deg) rotateY(-5deg) translateY(-5px)' },
        },
        burstAnim: {
          '0%': { transform: 'scale(0.1) translate(0, 0)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'scale(1) var(--tw-translate-x) var(--tw-translate-y)', opacity: '0' },
        }
      },
      animation: {
        heartbeat: 'heartbeat 1.5s infinite',
        float: 'float 3s ease-in-out infinite',
        burstAnim: 'burstAnim 2s forwards',
      },
      colors: {
        'fuchsia-neon': '#ff55ff',
        'fuchsia-dark': '#ff00ff',
        'purple-dark': '#aa00aa',
        'fuchsia-deep': '#550055',
        'pink-light': '#ff77ff',
        'pink-medium': '#ff99ff',
        'pink-lighter': '#ffbbff',
        'purple-deep': '#cc00cc',
        'red-pink': '#ff66aa',
        'dark-pink': '#ff0088',
        'medium-pink': '#ff3377',
        'light-pink': '#ff5599',
        'vivid-pink': '#ff0099',
      }
    },
  },
  plugins: [],
}