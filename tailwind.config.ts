import type { Config } from "tailwindcss";

function generateScale({
	name,
	isOverlay = false,
}: { name: string; isOverlay?: boolean }) {
	const scale = Array.from({ length: 12 }, (_, i) => {
		const id = i + 1;
		if (isOverlay) {
			return [[`a${id}`, `var(--${name}-a${id})`]];
		}
		return [
			[id, `var(--${name}-${id})`],
			[`a${id}`, `var(--${name}-a${id})`],
		];
	}).flat();

	return Object.fromEntries(scale);
}

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				gray: generateScale({ name: "gray" }),
				success: generateScale({ name: "green" }),
				warning: generateScale({ name: "yellow" }),
				danger: generateScale({ name: "red" }),
				info: generateScale({ name: "blue" }),
				brand: generateScale({ name: "violet" }),
				purple: generateScale({ name: "purple" }),
				orange: generateScale({ name: "orange" }),
				brown: generateScale({ name: "brown" }),
				pink: generateScale({ name: "pink" }),
				"black-overlay": generateScale({ name: "black", isOverlay: true }),
				"white-overlay": generateScale({ name: "white", isOverlay: true }),
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
