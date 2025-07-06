/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    // *** CRITICAL FIX: Add your file paths here ***
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js App Router projects
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js Pages Router projects
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // If you have a separate components directory
    // Add any other directories where you use Tailwind classes
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        // Change hsl(var(--...)) to oklch(var(--...)) to match your globals.css
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: '#4845D2',
          foreground: 'oklch(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))'
        },
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        chart: {
          '1': 'oklch(var(--chart-1))',
          '2': 'oklch(var(--chart-2))',
          '3': 'oklch(var(--chart-3))',
          '4': 'oklch(var(--chart-4))',
          '5': 'oklch(var(--chart-5))'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}