import { Title, Meta, Link } from "react-head";
import React from "react";

export interface SEOData {
  title: string;
  description: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
}

interface SEOProps {
  data: SEOData;
}

const SEO: React.FC<SEOProps> = ({ data }) => {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    canonical,
  } = data;

  return (
    <>
      <Title>{title}</Title>

      <Meta name="description" content={description} />

      {keywords && (
        <Meta
          name="keywords"
          content={Array.isArray(keywords) ? keywords.join(", ") : keywords}
        />
      )}

      <Meta property="og:title" content={ogTitle || title} />
      <Meta property="og:description" content={ogDescription || description} />

      {canonical && <Link rel="canonical" href={canonical} />}
    </>
  );
};

export default SEO;
