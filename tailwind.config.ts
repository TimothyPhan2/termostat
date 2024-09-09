import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			primary: {
			  DEFAULT: "#0d1b2a",
			  100: "#030609",
			  200: "#050b11",
			  300: "#08111a",
			  400: "#0b1622",
			  500: "#0d1b2a",
			  600: "#234870",
			  700: "#3875b6",
			  800: "#74a3d4",
			  900: "#bad1ea",
			},
			secondary: {
			  DEFAULT: "#1b263b",
			  100: "#05080c",
			  200: "#0b0f18",
			  300: "#101724",
			  400: "#161f30",
			  500: "#1b263b",
			  600: "#364c75",
			  700: "#5172af",
			  800: "#8ba1ca",
			  900: "#c5d0e4",
			},
			base: {
			  DEFAULT: "#415a77",
			  100: "#0d1218",
			  200: "#1a242f",
			  300: "#273647",
			  400: "#34485f",
			  500: "#415a77",
			  600: "#587aa1",
			  700: "#819bb9",
			  800: "#abbcd1",
			  900: "#d5dee8",
			},
			accent: {
			  DEFAULT: "#778da9",
			  100: "#161c23",
			  200: "#2c3746",
			  300: "#425369",
			  400: "#586f8d",
			  500: "#778da9",
			  600: "#91a2ba",
			  700: "#acbacb",
			  800: "#c8d1dc",
			  900: "#e3e8ee",
			},
			background: {
			  DEFAULT: "#e0e1dd",
			  100: "#2e2f2a",
			  200: "#5b5e53",
			  300: "#898c7e",
			  400: "#b4b6ad",
			  500: "#e0e1dd",
			  600: "#e5e6e3",
			  700: "#ececea",
			  800: "#f2f3f1",
			  900: "#f9f9f8",
			},
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
