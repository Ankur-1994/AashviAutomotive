// src/components/SeoHelmet.tsx
import { Helmet } from "react-helmet";
import { useSeoMeta } from "../hooks/useSeoHelmet";

interface SeoHelmetProps {
  pageKey?: string; // optional: page identifier like "home", "about"
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
  const meta = useSeoMeta();

  if (!meta) return null;

  const siteTitle = language === "en" ? meta.siteTitle_en : meta.siteTitle_hi;
  const defaultDesc =
    language === "en" ? meta.metaDescription_en : meta.metaDescription_hi;
  const keywords =
    language === "en"
      ? meta.keywords_en.join(", ")
      : meta.keywords_hi.join(", ");
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const desc = description || defaultDesc;
  const ogImage = image || meta.logo_url;

  const canonicalUrl =
    canonical ||
    (pageKey
      ? `https://aashviautomotive.web.app/${pageKey}`
      : "https://aashviautomotive.web.app/");

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org structured data */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

export default SeoHelmet;
