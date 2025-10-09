// src/utils/tawk.ts
declare global {
  interface Window {
    Tawk_API?: any;
  }
}

let loaded = false;

export function loadTawk() {
  if (loaded) return;
  loaded = true;

  const s = document.createElement("script");
  s.src = "https://embed.tawk.to/68e405ca2c740119528ea05b/1j6tbd8k1";
  s.async = true;
  s.defer = true;
  s.charset = "UTF-8";
  s.crossOrigin = "anonymous";
  document.body.appendChild(s);
}

export function loadTawkWhenIdle() {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(loadTawk);
  } else {
    setTimeout(loadTawk, 3000);
  }
}
