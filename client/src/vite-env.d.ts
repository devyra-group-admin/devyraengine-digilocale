/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MAP_CENTER_LAT: string
  readonly VITE_MAP_CENTER_LNG: string
  readonly VITE_MAP_DEFAULT_ZOOM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
