/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// 은창이꺼 커스텀
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'text-white',
    'text-gray-700',
    'text-gray-800',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

