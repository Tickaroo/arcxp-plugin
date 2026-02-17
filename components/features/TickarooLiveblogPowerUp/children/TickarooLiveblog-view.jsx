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

const TickarooLiveblogView = () => {

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
    source: TIK_USE_SEO ? 'tickaroo-liveblog' : null,
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

  const html =
  content?.html ??
  (params?.id && params?.config?.themeId && params?.config?.clientId
    ? `<tickaroo-liveblog 
        liveblogId="${params.id}" 
        themeId="${params.config.themeId}" 
        clientId="${params.config.clientId}" 
      </tickaroo-liveblog>`
    : '');

  return <><style>{`#fusion-app {
  height: 100%;
}



#container-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;  
  font-family: CustomSpecialC,OutputSans,Helvetica Neue,Helvetica,Arial,sans-serif;
  gap: .75rem;
  gap: 0;
}


#tickaroo-liveblog-container {
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);

  /* Optional: Legt fest, ob die Maske bis zum Rand (border-box) oder nur für den Content gilt */
  -webkit-mask-clip: border-box;
  mask-clip: border-box;
  overflow: hidden;
  min-height: 0;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
  pointer-events: none;
}

#tickaroo-liveblog-container .tik4 {
  --t4-sc: 0.7;
}

#go-to-btn {
  background-color: #E01A4F;
  color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.0006);
  font-family: inherit;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #C91747;
  font-weight: bold;
}

#go-to-btn:hover {
  background-color: #C91747;
  box-shadow: 0 2px 9px 4px rgba(224,224,224,0.15),0 2px 4px -1px rgba(224,224,224,0.15);
  border-color: #b2153f;
}

#go-to-btn:active {
  box-shadow: 0 2px 9px 4px rgba(224,224,224,0.3),0 2px 4px -1px rgba(224,224,224,0.18),inset 0 2px 4px 0 rgba(0,0,0,0.2);
  background-color: #B2153F;
  border-color: #a7133b;
}`}</style>{content?.schema && <script type="application/ld+json">{JSON.stringify(content.schema)}</script>}<div id="container-wrapper">
      <div id="tickaroo-liveblog-container" dangerouslySetInnerHTML={{ __html: html }} />
      <button id="go-to-btn" onClick={() => {window.open(`https://pro.tickaroo.com/tickers/${params?.id}/edit`, "_blank");}}>Open liveblog editor</button>
    </div></>;
};

export default TickarooLiveblogView;