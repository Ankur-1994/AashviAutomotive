// src/components/SeoHelmet.tsx
import { Title, Meta, Link as HeadLink } from "react-head";
import { useSeoMeta } from "../hooks/useSeoHelmet";

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
    <>
      <Title key="title">{fullTitle}</Title>
      <Meta key="description" name="description" content={desc} />
      <Meta key="keywords" name="keywords" content={keywords} />
      <HeadLink key="title" rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <Meta key="og-type" property="og:type" content="website" />
      <Meta key="og-title" property="og:title" content={fullTitle} />
      <Meta key="og-description" property="og:description" content={desc} />
      <Meta key="og-image" property="og:image" content={ogImage} />
      <Meta key="og-url" property="og:url" content={canonicalUrl} />
      <Meta key="og-site_name" property="og:site_name" content={siteTitle} />

      {/* Twitter Card */}
      <Meta
        key="twitter-card"
        name="twitter:card"
        content="summary_large_image"
      />
      <Meta key="twitter-title" name="twitter:title" content={fullTitle} />
      <Meta
        key="twitter-description"
        name="twitter:description"
        content={desc}
      />
      <Meta key="twitter-image" name="twitter:image" content={ogImage} />

      {/* Schema.org structured data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
};

export default SeoHelmet;
