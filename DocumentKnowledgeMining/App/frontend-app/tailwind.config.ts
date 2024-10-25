/* If we"d like to reference a value in the default theme we can import it from tailwindcss/defaultTheme */
import colors from "tailwindcss/colors.js";
import { Config } from "tailwindcss";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                lg: "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)",
                'outline-left': 'inset 1px 0 0 #DDD'
            },
            fontWeight: {
                semilight: "350",
            },
            
        },
        fontSize: {
            sm: ["11px", "10px"],
            base: ["14px", "20px"],
            lg: ["16px", "22px"], // h6 (header-bar nav, asset card title)
            xl: ["18px", "24px"], // h5 (header-bar left title)
            "2xl": ["20px", "28px"], // h4 (asset subtitles)
            "3xl": ["36px", "42px"], // h3
            "4xl": ["40px", "46px"], // h2 (subheader)
            "5xl": ["42px", "52px"], // h1 (header)
        },
        fontFamily: {
            sans: ["Segoe UI", "Roboto", "Helvetica Neue", "sans-serif", "ui-sans-serif", "system-ui", "roboto-condensed"],
        },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            white: "#ffffff",
            black: "#000000",
            neutral: {
                50: "#F8F8F8",
                100: "#F3F2F1",
                200: "#F0F1F3",
                300: "#DCDCDC",
                500: "#878787",
                550: "#676767",
                600: "#605E5C",
                700: "#323130",
            },
            primary: {
                100: "B892DD",
                500: "#A448C1",
            },
            secondary: {
                500: "#6FC58E",
            },
            tertiary: {
                500: "#253E8E",
            },
            zinc: {
                500: "#868686",
            },
            red: colors.red,
            yellow: colors.yellow,
            green: colors.green,
        },
    },
    plugins: [],
} as Config;
