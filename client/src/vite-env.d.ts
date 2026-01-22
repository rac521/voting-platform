/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: "https://voting-platform-3soe.onrender.com"
  // Add other variables here as you add them to Vercel
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}