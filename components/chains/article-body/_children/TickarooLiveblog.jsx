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
  })

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () =>
          reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
      });
    };

    const initLiveblog = async () => {
      if(!embed?.id) return;
      if(!embed?.config?.themeId) return;
      if(!embed?.config?.clientId) return;
      Array.from(document.scripts).some(s => s.src === new URL('//cdn.tickaroo.com/webng/embedjs/tik4.js', location.origin).href)
      ? undefined 
      : await loadScript('//cdn.tickaroo.com/webng/embedjs/tik4.js');

      const container = document.getElementById('tickaroo-liveblog-container');
      if(container) {
        if(content?.html) {
          container.innerHTML = content.html;
        } else {
          container.innerHTML = `<tickaroo-liveblog liveblogId="${embed.id}" themeId="${embed.config.themeId}" useSlideshow="true" clientId="${embed.config.clientId}" disableTracking="true"></tickaroo-liveblog>`;
        }
      }
    };

    initLiveblog().catch(console.error);

    return () => {
      const scripts = document.querySelectorAll('script[src*="tickaroo.com"]');
      scripts.forEach(script => script.remove());
    }
  }, [embed?.id, content?.html])

  return <>
    <style>{`tickaroo-liveblog { display: grid; }`}</style>
    <link id="tickaroo-css" rel="stylesheet" href="https://cdn.tickaroo.com/webng/embedjs/tik4.css" />
    {content?.schema && <script type="application/ld+json">{JSON.stringify(content.schema)}</script>}
    <div>
      <div id="tickaroo-liveblog-container" dangerouslySetInnerHTML={{ __html: content?.html || '' }}></div>
    </div>
  </>;
};

export default TickarooLiveblogView;