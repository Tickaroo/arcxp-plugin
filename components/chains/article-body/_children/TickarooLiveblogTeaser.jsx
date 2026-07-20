import { useEffect } from 'react';
import { useContent } from 'fusion:content'
import { TIK_USE_SEO } from 'fusion:environment';

// Renders the Tickaroo Liveblog Teaser widget. Mirrors TickarooLiveblog.jsx but
// renders <tickaroo-liveblog-teaser> instead of <tickaroo-liveblog>, prefetches
// from the teaser source, and emits no JSON-LD (the teaser prefetch returns
// `{ html }` only — no `schema`). An optional embed.config.liveblogUrl hard-links
// the teaser to a specific story; when omitted the widget resolves the link
// automatically.
const TickarooLiveblogTeaser = ({ embed }) => {
  const content = useContent({
    source: TIK_USE_SEO ? 'tickaroo-liveblog-teaser' : null,
    query: {
      liveblogId: embed?.id,
      themeId: embed?.config?.themeId
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
    ? ` liveblogUrl="${embed.config.liveblogUrl}"`
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
