import { useEffect } from "react";

const SITE_NAME = "99mini";
const DEFAULT_DESC = "프론트엔드 개발자 99mini의 블로그";
const SITE_URL = "https://99mini.github.io";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
};

function updateMeta(attrKey: string, attrVal: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrKey}="${attrVal}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrKey, attrVal);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function SEO({ title, description = DEFAULT_DESC, image, path = "" }: Props) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/og-default.png`;

  useEffect(() => {
    document.title = fullTitle;
    updateMeta("name", "description", description);
    updateMeta("property", "og:title", fullTitle);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:url", url);
    updateMeta("property", "og:image", ogImage);
    updateMeta("property", "og:type", "website");
    updateMeta("name", "twitter:card", "summary_large_image");
    updateMeta("name", "twitter:title", fullTitle);
    updateMeta("name", "twitter:description", description);
  }, [fullTitle, description, url, ogImage]);

  return null;
}
