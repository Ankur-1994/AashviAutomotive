// src/hooks/useSeoHelmet.ts
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export interface SiteMeta {
  siteTitle_en: string;   // ✅ added
  siteTitle_hi: string;   // ✅ added
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
    const fetchMeta = async () => {
      try {
        const snap = await getDoc(doc(db, "content", "site_meta"));
        if (snap.exists()) setMeta(snap.data() as SiteMeta);
      } catch (err) {
        console.error("Failed to load site_meta:", err);
      }
    };
    fetchMeta();
  }, []);

  return meta;
}
