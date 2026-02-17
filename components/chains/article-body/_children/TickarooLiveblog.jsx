import { useEffect } from 'react';
import { useContent } from 'fusion:content'
import { TIK_USE_SEO } from 'fusion:environment';

const TickarooLiveblogView = ({ embed }) => {
  const content = useContent({
    source: TIK_USE_SEO ? 'tickaroo-liveblog' : null,
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
  const html =
    content?.html ??
    (embed?.id && embed?.config?.themeId && embed?.config?.clientId
      ? `<tickaroo-liveblog 
          liveblogId="${embed.id}" 
          themeId="${embed.config.themeId}" 
          clientId="${embed.config.clientId}" 
        </tickaroo-liveblog>`
      : '');
  return (
    <>
      <style>{`tickaroo-liveblog { display: grid; }`}</style>
      <link
        id="tickaroo-css"
        rel="stylesheet"
        href="https://cdn.tickaroo.com/webng/embedjs/tik4.css"
      />
      {content?.schema && (
        <script type="application/ld+json">
          {JSON.stringify(content.schema)}
        </script>
      )}
      <div
        id="tickaroo-liveblog-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default TickarooLiveblogView;