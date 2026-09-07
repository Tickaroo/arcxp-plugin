import { useEffect } from 'react';
import { useContent } from 'fusion:content'
import { useFusionContext } from 'fusion:context';
import getProperties from 'fusion:properties';
import { TIK_USE_SEO, TIK_SITE_ORIGIN } from 'fusion:environment';

// Renders the Tickaroo Liveblog Teaser widget. Mirrors TickarooLiveblog.jsx but
// renders <tickaroo-liveblog-teaser> instead of <tickaroo-liveblog>, prefetches
// from the teaser source, and emits no JSON-LD (the teaser prefetch returns
// `{ html }` only — no `schema`). An optional embed.config.liveblogUrl hard-links
// the teaser to a specific story and is passed to the prefetch too, so the
// server-rendered anchor already carries it; when omitted the link is resolved
// from analytics data for this site's origin, and failing that from the
// liveblog's canonical URL.
const escapeAttr = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The analytics lookup matches on an origin, so a value carrying a path — or a
// bare hostname with no scheme — would silently find nothing rather than fail.
const originOf = (value) => {
  if (!value) {
    return undefined;
  }
  try {
    return new URL(String(value).includes('://') ? String(value) : `https://${value}`).origin;
  } catch (e) {
    return undefined;
  }
};

const TickarooLiveblogTeaser = ({ embed }) => {
  // A browser render reads window.location itself; this is for the server render,
  // which has no location and would otherwise skip the analytics lookup entirely.
  // Site properties come first because an ArcXP bundle can serve several sites,
  // and each needs its own origin — TIK_SITE_ORIGIN is one value for all of them.
  const { arcSite } = useFusionContext();
  const siteProperties = getProperties(arcSite) || {};
  const siteOrigin = originOf(siteProperties.siteUrl || siteProperties.websiteDomain || TIK_SITE_ORIGIN);

  const content = useContent({
    source: TIK_USE_SEO ? 'tickaroo-liveblog-teaser' : null,
    query: {
      liveblogId: embed?.id,
      themeId: embed?.config?.themeId,
      liveblogUrl: embed?.config?.liveblogUrl,
      // A configured link target makes the lookup redundant; leaving the origin
      // out then also keeps it out of the cache key.
      includeLiveblogUrl: embed?.config?.liveblogUrl ? undefined : siteOrigin
    }
  });
  useEffect(() => {
    async function load() {
      if (!embed?.id || !embed?.config?.themeId || !embed?.config?.clientId) {
        return;
      }
      const alreadyLoaded = Array.from(document.scripts).some(
        s => s.src.includes('tik4.js')
      );
      if (!alreadyLoaded) {
        const script = document.createElement('script');
        script.src = '//cdn.tickaroo.com/webng/embedjs/tik4.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
    load().catch(console.error);
  }, [embed?.id]);
  const liveblogUrlAttr = embed?.config?.liveblogUrl
    ? ` liveblogUrl="${escapeAttr(embed.config.liveblogUrl)}"`
    : '';
  const html =
    content?.html ??
    (embed?.id && embed?.config?.themeId && embed?.config?.clientId
      ? `<tickaroo-liveblog-teaser
          liveblogId="${embed.id}"
          themeId="${embed.config.themeId}"
          clientId="${embed.config.clientId}"${liveblogUrlAttr}>
        </tickaroo-liveblog-teaser>`
      : '');
  return (
    <>
      <style>{`tickaroo-liveblog-teaser { display: grid; }`}</style>
      <link
        id="tickaroo-css"
        rel="stylesheet"
        href="https://cdn.tickaroo.com/webng/embedjs/tik4.css"
      />
      <div
        id="tickaroo-liveblog-teaser-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default TickarooLiveblogTeaser;
