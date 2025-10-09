import { app } from "./firebase";

let dbInstance: any = null;
let analyticsLoaded = false;

/** Lazy-load Firestore only when needed */
export async function getDb() {
  if (dbInstance) return dbInstance;

  const { getFirestore } = await import("firebase/firestore");
  dbInstance = getFirestore(app);
  return dbInstance;
}

/** Lazy-load Analytics only when idle (optional) */
export function loadAnalyticsWhenIdle() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(async () => {
      const { getAnalytics } = await import("firebase/analytics");
      getAnalytics(app);
    });
  } else {
    setTimeout(async () => {
      const { getAnalytics } = await import("firebase/analytics");
      getAnalytics(app);
    }, 3000);
  }
}
