import { useEffect, useState } from 'react';
import { useContent } from 'fusion:content'
import { TIK_USE_SEO } from 'fusion:environment';

const sendMessage = function(action, data) {
  window.parent.postMessage(
    JSON.stringify({
      source: 'custom_embed',
      action,
      data,
      key: parseQueryString()['k']
    }),
    '*'
  )
}

const parseQueryString = function() {
  const params = location.search.split('?')[1] || ''
  const kv = params.split('&')
  return kv.reduce((result, item) => {
    const [key, value] = item.split('=')
    return Object.assign(result, {
      [key]: value
    })
  }, {})
}

const TickarooLiveblogTeaserView = () => {

  useEffect(() => {
    sendMessage('ready', {
      height: document.documentElement.scrollHeight
    })

    const parameters = Object.assign(
      {
        wait: 0
      },
      parseQueryString()

    )
    setParams(JSON.parse(decodeURIComponent(parameters.p)))
  }, [])

  const [params, setParams] = useState()

  const content = useContent({
    source: TIK_USE_SEO ? 'tickaroo-liveblog-teaser' : null,
    query: {
      liveblogId: params?.id,
      themeId: params?.config?.themeId
    }
  })

  useEffect(() => {
    async function load() {
      if (!params?.id || !params?.config?.themeId || !params?.config?.clientId) {
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
  }, [params?.id]);

  const liveblogUrlAttr = params?.config?.liveblogUrl
    ? ` liveblogUrl="${params.config.liveblogUrl}"`
    : '';

  const html =
  content?.html ??
  (params?.id && params?.config?.themeId && params?.config?.clientId
    ? `<tickaroo-liveblog-teaser
        liveblogId="${params.id}"
        themeId="${params.config.themeId}"
        clientId="${params.config.clientId}"${liveblogUrlAttr}>
      </tickaroo-liveblog-teaser>`
    : '');

  return <><style>{`#fusion-app {
  height: 100%;
}

#container-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: CustomSpecialC,OutputSans,Helvetica Neue,Helvetica,Arial,sans-serif;
}

#tickaroo-liveblog-teaser-container {
  min-height: 0;
}`}</style><div id="container-wrapper">
      <div id="tickaroo-liveblog-teaser-container" dangerouslySetInnerHTML={{ __html: html }} />
    </div></>;
};

export default TickarooLiveblogTeaserView;
