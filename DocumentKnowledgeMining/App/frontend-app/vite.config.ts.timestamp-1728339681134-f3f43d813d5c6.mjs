// vite.config.ts
import { defineConfig } from "file:///C:/Users/gpickett/OneDrive%20-%20Microsoft/Documents/AzureDevops/KnowledgeMiningDigitalAssets/App/frontend-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/gpickett/OneDrive%20-%20Microsoft/Documents/AzureDevops/KnowledgeMiningDigitalAssets/App/frontend-app/node_modules/@vitejs/plugin-react/dist/index.mjs";

// postcss.config.js
import tailwind from "file:///C:/Users/gpickett/OneDrive%20-%20Microsoft/Documents/AzureDevops/KnowledgeMiningDigitalAssets/App/frontend-app/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/gpickett/OneDrive%20-%20Microsoft/Documents/AzureDevops/KnowledgeMiningDigitalAssets/App/frontend-app/node_modules/autoprefixer/lib/autoprefixer.js";

// tailwind.config.ts
import colors from "file:///C:/Users/gpickett/OneDrive%20-%20Microsoft/Documents/AzureDevops/KnowledgeMiningDigitalAssets/App/frontend-app/node_modules/tailwindcss/colors.js";
var tailwind_config_default = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        lg: "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)",
        "outline-left": "inset 1px 0 0 #DDD"
      },
      fontWeight: {
        semilight: "350"
      }
    },
    fontSize: {
      sm: ["11px", "10px"],
      base: ["14px", "20px"],
      lg: ["16px", "22px"],
      // h6 (header-bar nav, asset card title)
      xl: ["18px", "24px"],
      // h5 (header-bar left title)
      "2xl": ["20px", "28px"],
      // h4 (asset subtitles)
      "3xl": ["36px", "42px"],
      // h3
      "4xl": ["40px", "46px"],
      // h2 (subheader)
      "5xl": ["42px", "52px"]
      // h1 (header)
    },
    fontFamily: {
      sans: ["Segoe UI", "Roboto", "Helvetica Neue", "sans-serif", "ui-sans-serif", "system-ui", "roboto-condensed"]
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
        700: "#323130"
      },
      primary: {
        100: "B892DD",
        500: "#A448C1"
      },
      secondary: {
        500: "#6FC58E"
      },
      tertiary: {
        500: "#253E8E"
      },
      zinc: {
        500: "#868686"
      },
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green
    }
  },
  plugins: []
};

// postcss.config.js
var postcss_config_default = {
  plugins: [tailwind(tailwind_config_default), autoprefixer]
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: postcss_config_default
  },
  server: {
    watch: {
      usePolling: true
    },
    host: true,
    strictPort: true,
    port: 5900
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicG9zdGNzcy5jb25maWcuanMiLCAidGFpbHdpbmQuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3BpY2tldHRcXFxcT25lRHJpdmUgLSBNaWNyb3NvZnRcXFxcRG9jdW1lbnRzXFxcXEF6dXJlRGV2b3BzXFxcXEtub3dsZWRnZU1pbmluZ0RpZ2l0YWxBc3NldHNcXFxcQXBwXFxcXGZyb250ZW5kLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3BpY2tldHRcXFxcT25lRHJpdmUgLSBNaWNyb3NvZnRcXFxcRG9jdW1lbnRzXFxcXEF6dXJlRGV2b3BzXFxcXEtub3dsZWRnZU1pbmluZ0RpZ2l0YWxBc3NldHNcXFxcQXBwXFxcXGZyb250ZW5kLWFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ3BpY2tldHQvT25lRHJpdmUlMjAtJTIwTWljcm9zb2Z0L0RvY3VtZW50cy9BenVyZURldm9wcy9Lbm93bGVkZ2VNaW5pbmdEaWdpdGFsQXNzZXRzL0FwcC9mcm9udGVuZC1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBwb3N0Y3NzIGZyb20gXCIuL3Bvc3Rjc3MuY29uZmlnLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgY3NzOiB7XHJcbiAgICAgICAgcG9zdGNzcyxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICB3YXRjaDoge1xyXG4gICAgICAgICAgICB1c2VQb2xsaW5nOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaG9zdDogdHJ1ZSxcclxuICAgICAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgICAgIHBvcnQgOiA1OTAwXHJcbiAgICB9XHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdwaWNrZXR0XFxcXE9uZURyaXZlIC0gTWljcm9zb2Z0XFxcXERvY3VtZW50c1xcXFxBenVyZURldm9wc1xcXFxLbm93bGVkZ2VNaW5pbmdEaWdpdGFsQXNzZXRzXFxcXEFwcFxcXFxmcm9udGVuZC1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdwaWNrZXR0XFxcXE9uZURyaXZlIC0gTWljcm9zb2Z0XFxcXERvY3VtZW50c1xcXFxBenVyZURldm9wc1xcXFxLbm93bGVkZ2VNaW5pbmdEaWdpdGFsQXNzZXRzXFxcXEFwcFxcXFxmcm9udGVuZC1hcHBcXFxccG9zdGNzcy5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dwaWNrZXR0L09uZURyaXZlJTIwLSUyME1pY3Jvc29mdC9Eb2N1bWVudHMvQXp1cmVEZXZvcHMvS25vd2xlZGdlTWluaW5nRGlnaXRhbEFzc2V0cy9BcHAvZnJvbnRlbmQtYXBwL3Bvc3Rjc3MuY29uZmlnLmpzXCI7aW1wb3J0IHRhaWx3aW5kIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcclxuaW1wb3J0IHRhaWx3aW5kQ29uZmlnIGZyb20gXCIuL3RhaWx3aW5kLmNvbmZpZ1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgcGx1Z2luczogW3RhaWx3aW5kKHRhaWx3aW5kQ29uZmlnKSwgYXV0b3ByZWZpeGVyXSxcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncGlja2V0dFxcXFxPbmVEcml2ZSAtIE1pY3Jvc29mdFxcXFxEb2N1bWVudHNcXFxcQXp1cmVEZXZvcHNcXFxcS25vd2xlZGdlTWluaW5nRGlnaXRhbEFzc2V0c1xcXFxBcHBcXFxcZnJvbnRlbmQtYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxncGlja2V0dFxcXFxPbmVEcml2ZSAtIE1pY3Jvc29mdFxcXFxEb2N1bWVudHNcXFxcQXp1cmVEZXZvcHNcXFxcS25vd2xlZGdlTWluaW5nRGlnaXRhbEFzc2V0c1xcXFxBcHBcXFxcZnJvbnRlbmQtYXBwXFxcXHRhaWx3aW5kLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ3BpY2tldHQvT25lRHJpdmUlMjAtJTIwTWljcm9zb2Z0L0RvY3VtZW50cy9BenVyZURldm9wcy9Lbm93bGVkZ2VNaW5pbmdEaWdpdGFsQXNzZXRzL0FwcC9mcm9udGVuZC1hcHAvdGFpbHdpbmQuY29uZmlnLnRzXCI7LyogSWYgd2VcImQgbGlrZSB0byByZWZlcmVuY2UgYSB2YWx1ZSBpbiB0aGUgZGVmYXVsdCB0aGVtZSB3ZSBjYW4gaW1wb3J0IGl0IGZyb20gdGFpbHdpbmRjc3MvZGVmYXVsdFRoZW1lICovXHJcbmltcG9ydCBjb2xvcnMgZnJvbSBcInRhaWx3aW5kY3NzL2NvbG9ycy5qc1wiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwidGFpbHdpbmRjc3NcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGNvbnRlbnQ6IFtcIi4vaW5kZXguaHRtbFwiLCBcIi4vc3JjLyoqLyoue2pzLHRzLGpzeCx0c3h9XCJdLFxyXG4gICAgdGhlbWU6IHtcclxuICAgICAgICBleHRlbmQ6IHtcclxuICAgICAgICAgICAgYm94U2hhZG93OiB7XHJcbiAgICAgICAgICAgICAgICBsZzogXCIwcHggMC4zcHggMC45cHggcmdiYSgwLCAwLCAwLCAwLjEpLCAwcHggMS42cHggMy42cHggcmdiYSgwLCAwLCAwLCAwLjEzKVwiLFxyXG4gICAgICAgICAgICAgICAgJ291dGxpbmUtbGVmdCc6ICdpbnNldCAxcHggMCAwICNEREQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6IHtcclxuICAgICAgICAgICAgICAgIHNlbWlsaWdodDogXCIzNTBcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb250U2l6ZToge1xyXG4gICAgICAgICAgICBzbTogW1wiMTFweFwiLCBcIjEwcHhcIl0sXHJcbiAgICAgICAgICAgIGJhc2U6IFtcIjE0cHhcIiwgXCIyMHB4XCJdLFxyXG4gICAgICAgICAgICBsZzogW1wiMTZweFwiLCBcIjIycHhcIl0sIC8vIGg2IChoZWFkZXItYmFyIG5hdiwgYXNzZXQgY2FyZCB0aXRsZSlcclxuICAgICAgICAgICAgeGw6IFtcIjE4cHhcIiwgXCIyNHB4XCJdLCAvLyBoNSAoaGVhZGVyLWJhciBsZWZ0IHRpdGxlKVxyXG4gICAgICAgICAgICBcIjJ4bFwiOiBbXCIyMHB4XCIsIFwiMjhweFwiXSwgLy8gaDQgKGFzc2V0IHN1YnRpdGxlcylcclxuICAgICAgICAgICAgXCIzeGxcIjogW1wiMzZweFwiLCBcIjQycHhcIl0sIC8vIGgzXHJcbiAgICAgICAgICAgIFwiNHhsXCI6IFtcIjQwcHhcIiwgXCI0NnB4XCJdLCAvLyBoMiAoc3ViaGVhZGVyKVxyXG4gICAgICAgICAgICBcIjV4bFwiOiBbXCI0MnB4XCIsIFwiNTJweFwiXSwgLy8gaDEgKGhlYWRlcilcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvbnRGYW1pbHk6IHtcclxuICAgICAgICAgICAgc2FuczogW1wiU2Vnb2UgVUlcIiwgXCJSb2JvdG9cIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBcInNhbnMtc2VyaWZcIiwgXCJ1aS1zYW5zLXNlcmlmXCIsIFwic3lzdGVtLXVpXCIsIFwicm9ib3RvLWNvbmRlbnNlZFwiXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yczoge1xyXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogXCJ0cmFuc3BhcmVudFwiLFxyXG4gICAgICAgICAgICBjdXJyZW50OiBcImN1cnJlbnRDb2xvclwiLFxyXG4gICAgICAgICAgICB3aGl0ZTogXCIjZmZmZmZmXCIsXHJcbiAgICAgICAgICAgIGJsYWNrOiBcIiMwMDAwMDBcIixcclxuICAgICAgICAgICAgbmV1dHJhbDoge1xyXG4gICAgICAgICAgICAgICAgNTA6IFwiI0Y4RjhGOFwiLFxyXG4gICAgICAgICAgICAgICAgMTAwOiBcIiNGM0YyRjFcIixcclxuICAgICAgICAgICAgICAgIDIwMDogXCIjRjBGMUYzXCIsXHJcbiAgICAgICAgICAgICAgICAzMDA6IFwiI0RDRENEQ1wiLFxyXG4gICAgICAgICAgICAgICAgNTAwOiBcIiM4Nzg3ODdcIixcclxuICAgICAgICAgICAgICAgIDU1MDogXCIjNjc2NzY3XCIsXHJcbiAgICAgICAgICAgICAgICA2MDA6IFwiIzYwNUU1Q1wiLFxyXG4gICAgICAgICAgICAgICAgNzAwOiBcIiMzMjMxMzBcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpbWFyeToge1xyXG4gICAgICAgICAgICAgICAgMTAwOiBcIkI4OTJERFwiLFxyXG4gICAgICAgICAgICAgICAgNTAwOiBcIiNBNDQ4QzFcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2Vjb25kYXJ5OiB7XHJcbiAgICAgICAgICAgICAgICA1MDA6IFwiIzZGQzU4RVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZXJ0aWFyeToge1xyXG4gICAgICAgICAgICAgICAgNTAwOiBcIiMyNTNFOEVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgemluYzoge1xyXG4gICAgICAgICAgICAgICAgNTAwOiBcIiM4Njg2ODZcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVkOiBjb2xvcnMucmVkLFxyXG4gICAgICAgICAgICB5ZWxsb3c6IGNvbG9ycy55ZWxsb3csXHJcbiAgICAgICAgICAgIGdyZWVuOiBjb2xvcnMuZ3JlZW4sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXSxcclxufSBhcyBDb25maWc7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc2dCLFNBQVMsb0JBQW9CO0FBQ25pQixPQUFPLFdBQVc7OztBQ0QwZixPQUFPLGNBQWM7QUFDamlCLE9BQU8sa0JBQWtCOzs7QUNBekIsT0FBTyxZQUFZO0FBR25CLElBQU8sMEJBQVE7QUFBQSxFQUNYLFNBQVMsQ0FBQyxnQkFBZ0IsNEJBQTRCO0FBQUEsRUFDdEQsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLE1BQ0osV0FBVztBQUFBLFFBQ1AsSUFBSTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUEsTUFDcEI7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNSLFdBQVc7QUFBQSxNQUNmO0FBQUEsSUFFSjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ04sSUFBSSxDQUFDLFFBQVEsTUFBTTtBQUFBLE1BQ25CLE1BQU0sQ0FBQyxRQUFRLE1BQU07QUFBQSxNQUNyQixJQUFJLENBQUMsUUFBUSxNQUFNO0FBQUE7QUFBQSxNQUNuQixJQUFJLENBQUMsUUFBUSxNQUFNO0FBQUE7QUFBQSxNQUNuQixPQUFPLENBQUMsUUFBUSxNQUFNO0FBQUE7QUFBQSxNQUN0QixPQUFPLENBQUMsUUFBUSxNQUFNO0FBQUE7QUFBQSxNQUN0QixPQUFPLENBQUMsUUFBUSxNQUFNO0FBQUE7QUFBQSxNQUN0QixPQUFPLENBQUMsUUFBUSxNQUFNO0FBQUE7QUFBQSxJQUMxQjtBQUFBLElBQ0EsWUFBWTtBQUFBLE1BQ1IsTUFBTSxDQUFDLFlBQVksVUFBVSxrQkFBa0IsY0FBYyxpQkFBaUIsYUFBYSxrQkFBa0I7QUFBQSxJQUNqSDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ0osYUFBYTtBQUFBLE1BQ2IsU0FBUztBQUFBLE1BQ1QsT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ0wsSUFBSTtBQUFBLFFBQ0osS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNUO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDUCxLQUFLO0FBQUEsTUFDVDtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ04sS0FBSztBQUFBLE1BQ1Q7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNGLEtBQUs7QUFBQSxNQUNUO0FBQUEsTUFDQSxLQUFLLE9BQU87QUFBQSxNQUNaLFFBQVEsT0FBTztBQUFBLE1BQ2YsT0FBTyxPQUFPO0FBQUEsSUFDbEI7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTLENBQUM7QUFDZDs7O0FENURBLElBQU8seUJBQVE7QUFBQSxFQUNYLFNBQVMsQ0FBQyxTQUFTLHVCQUFjLEdBQUcsWUFBWTtBQUNwRDs7O0FERkEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLEtBQUs7QUFBQSxJQUNEO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osT0FBTztBQUFBLE1BQ0gsWUFBWTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixNQUFPO0FBQUEsRUFDWDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
