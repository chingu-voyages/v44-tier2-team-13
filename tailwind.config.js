/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-900": "#0C134F",
                "primary-800": "#1D267D",
                "primary-700": "#5C469C",
                "primary-600": "#D4ADFC",
            },
            fontFamily: {
                Inter: ["Inter"],
            },
        },
    },
    plugins: [],
};
