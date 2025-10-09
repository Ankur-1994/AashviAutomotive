// src/hooks/useSeoHelmet.ts
import { useEffect, useState } from "react";

export interface SiteMeta {
  siteTitle_en: string; // ✅ added
  siteTitle_hi: string; // ✅ added
  name_en: string;
  name_hi: string;
  tagline_en: string;
  tagline_hi: string;
  description_en: string;
  description_hi: string;
  metaDescription_en: string;
  metaDescription_hi: string;
  keywords_en: string[];
  keywords_hi: string[];
  logo_url: string;
  googleMapUrl: string;
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  address_hi: string;
  businessWhatsApp: string;
  email: string;
  phone: string;
  lat: string;
  lng: string;
  openingHours: string[];
}

export function useSeoMeta() {
  const [meta, setMeta] = useState<SiteMeta | null>(null);

  useEffect(() => {
    let active = true;

    const fetchMeta = async () => {
      try {
        // ✅ Lazy-load Firestore only when needed
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy import Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "site_meta"));
        if (!active || !snap.exists()) return;

        const data = snap.data() as SiteMeta;
        setMeta(data);

        // ✅ Cache for future reuse
        localStorage.setItem(
          "site_meta_data_v1",
          JSON.stringify({ t: Date.now(), v: data })
        );
      } catch (err) {
        console.error("Failed to load site_meta:", err);
      }
    };

    // ✅ Persistent cache with TTL (24 hours)
    const CACHE_KEY = "site_meta_data_v1";
    const TTL = 24 * 60 * 60 * 1000; // 1 day

    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { t, v } = JSON.parse(raw);
        if (Date.now() - t < TTL) {
          setMeta(v);
          return; // skip fetch if still fresh
        }
      }
    } catch {
      /* ignore corrupted cache */
    }

    fetchMeta();

    return () => {
      active = false;
    };
  }, []);

  return meta;
}
