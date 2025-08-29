import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['date-fns/locale'],
    include: ['date-fns'],
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Ignore Stripe's internal locale imports
        if (id.includes('stripe') && id.includes('./en')) {
          return true;
        }
        return false;
      }
    }
  },
}));
