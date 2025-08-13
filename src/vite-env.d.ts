/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_C3D_API_KEY: string
  readonly VITE_C3D_SCENE_NAME: string
  readonly VITE_C3D_SCENE_ID: string
  readonly VITE_C3D_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
