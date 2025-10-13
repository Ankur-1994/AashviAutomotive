/// <reference types="vite/client" />

// ✅ Explicitly reference React Three Fiber’s type declarations
/// <reference path="../node_modules/@react-three/fiber/dist/declarations/src/index.d.ts" />
/// <reference path="../node_modules/@react-three/fiber/dist/declarations/src/three-types.d.ts" />

// ✅ Declare optional modules used in your project
declare module "@vitejs/plugin-react-swc";
declare module "rollup-plugin-visualizer";
declare module "vite-plugin-compression";
declare module "@react-three/fiber";
declare module "@react-three/drei";

// ✅ Environment variable typings
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID_CONTACT: string;
  readonly VITE_EMAILJS_TEMPLATE_ID_BOOKING: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
