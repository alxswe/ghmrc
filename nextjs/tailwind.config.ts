import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            animation: {
                typing: "typing 1s steps(6), blink 1s infinite",
            },
            keyframes: {
                typing: {
                    from: {
                        width: "0",
                    },
                    to: {
                        width: "6ch",
                    },
                },
                blink: {
                    from: {
                        "border-right-color": "transparent",
                    },
                    to: {
                        "border-right-color": "black",
                    },
                },
            },
            fontFamily: {
                satoshi: ["Satoshi", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
