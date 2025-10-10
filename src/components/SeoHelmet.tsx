import { Helmet } from "react-helmet-async";
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
      ? `https://aashviautomotive.in/${pageKey}`
      : "https://aashviautomotive.in/");

  return (
    <Helmet>
      {/* Basic Meta */}
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={desc} />
      <meta key="keywords" name="keywords" content={keywords} />
      <link key="canonical" rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta */}
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta key="og:description" property="og:description" content={desc} />
      <meta key="og:image" property="og:image" content={ogImage} />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta key="og:site_name" property="og:site_name" content={siteTitle} />
      <meta
        key="og:locale"
        property="og:locale"
        content={language === "hi" ? "hi_IN" : "en_IN"}
      />

      {/* Twitter Meta */}
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

      {/* Structured Data */}
      {schema && (
        <script
          key="ld-json-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Helmet>
  );
};

export default SeoHelmet;
