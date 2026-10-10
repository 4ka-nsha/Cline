/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Data source mode: "mock" (default) or "live". */
  readonly VITE_DATA_MODE?: 'mock' | 'live'
  /** Non-secret public backend base URL, used only in "live" mode. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
