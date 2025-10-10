import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

interface SeoHelmetProps {
  pageKey?: string;
  language: "en" | "hi";
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  schema?: object;
}

const SeoHelmet = ({
  pageKey,
  language,
  title,
  description,
  image,
  canonical,
  schema,
}: SeoHelmetProps) => {
  const siteTitle =
    language === "en"
      ? "Aashvi Automotive — Trusted Multibrand Two-Wheeler Workshop"
      : "आश्वी ऑटोमोटिव — भरोसेमंद मल्टीब्रांड टू-व्हीलर वर्कशॉप";

  const fullTitle = title ? `${title} | Aashvi Automotive` : siteTitle;
  const desc =
    description ||
    (language === "en"
      ? "Aashvi Automotive offers expert bike service, repair, and maintenance for all brands in Rajnagar, Madhubani."
      : "आश्वी ऑटोमोटिव राजनगर, मधुबनी में सभी ब्रांडों की बाइक सर्विस, रिपेयर और मेंटेनेंस प्रदान करता है।");

  const ogImage =
    image ||
    "https://cdn.jsdelivr.net/gh/Ankur-1994/AashviAutomotive@main/src/assets/logo.jpeg";

  const canonicalUrl =
    canonical ||
    (pageKey
      ? `https://aashviautomotive.in/${pageKey}`
      : "https://aashviautomotive.in/");

  // ✅ Ensure structured data always stays in <head>
  useEffect(() => {
    const existing = document.getElementById("structured-data");
    if (existing) existing.remove();

    if (schema && Object.keys(schema).length > 0) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "structured-data";
      script.text = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    }
  }, [schema]);

  return (
    <Helmet>
      {/* ✅ Basic Meta */}
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={desc} />
      <meta
        key="keywords"
        name="keywords"
        content="bike service, bike repair, Rajnagar, Madhubani, two wheeler workshop, scooter repair, Aashvi Automotive"
      />
      <meta key="robots" name="robots" content="index, follow" />
      <link key="canonical" rel="canonical" href={canonicalUrl} />

      {/* ✅ Open Graph Meta */}
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta key="og:description" property="og:description" content={desc} />
      <meta key="og:image" property="og:image" content={ogImage} />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta
        key="og:locale"
        property="og:locale"
        content={language === "en" ? "en_IN" : "hi_IN"}
      />
      <meta
        key="og:site_name"
        property="og:site_name"
        content="Aashvi Automotive"
      />

      {/* ✅ Twitter Meta */}
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:title" name="twitter:title" content={fullTitle} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={desc}
      />
      <meta key="twitter:image" name="twitter:image" content={ogImage} />

      {/* ✅ Misc Meta */}
      <meta key="theme-color" name="theme-color" content="#0B3B74" />
      <link key="icon" rel="icon" href="/favicon.ico" />
      <link
        key="apple-icon"
        rel="apple-touch-icon"
        href="/apple-touch-icon.png"
      />
      <link key="manifest" rel="manifest" href="/manifest.webmanifest" />
    </Helmet>
  );
};

export default SeoHelmet;
