import { useState } from 'react';
import { TIK_CLIENT_ID, TIK_THEMES } from 'fusion:environment';

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

const handleSubmit = (liveblogId, themeId, liveblogUrl) => {
  const config = { themeId: themeId, clientId: TIK_CLIENT_ID }
  if (liveblogUrl) config.liveblogUrl = liveblogUrl
  const ansCustomEmbed = {
    id: liveblogId,
    url: 'https://pro.tickaroo.com/editor-v2/' + liveblogId,
    config
  }

  sendMessage('data', ansCustomEmbed)
}

const TickarooLiveblogTeaserSearch = () => {
  const [liveblogId, setLiveblogId] = useState('');
  const [themeId, setThemeId] = useState(TIK_THEMES[0].id);
  const [liveblogUrl, setLiveblogUrl] = useState('');
  const handleInputChange = (e) => {
    setLiveblogId(e.target.value);
  };

  const handleThemeChange = (e) => {
    setThemeId(e.target.value);
  };

  const handleLiveblogUrlChange = (e) => {
    setLiveblogUrl(e.target.value);
  };

  const handleButtonClick = () => {
    if (liveblogId.trim()) {
      handleSubmit(liveblogId.trim(), themeId, liveblogUrl.trim());
    }
  };

  return (
    <><style>{`#form-container {
  font-family: CustomSpecialC,OutputSans,Helvetica Neue,Helvetica,Arial,sans-serif;
  padding: 2rem;
}


#form-container label {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .02em;
  line-height: 16px;
  align-items: center;
  color: #191b34;
  display: flex;
  height: 21px;
  margin-bottom: .5rem;
}

#liveblog-id ~ label {
  margin-top: 1rem;
}


#liveblog-id,
#liveblog-url,
#theme-select {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .02em;
  background: #FFF;
  line-height: 1.2rem;
  padding: 6px 8px 5px;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  color: var(--bs-gray-900);
  display: block;
  flex: 1 1;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  border: 1px solid #656a86;
  height: 40px;
  width: 100%;
}

#theme-select {
  background-repeat: no-repeat;
  background-position: calc(100% - .5rem) center;
  padding-right: 2rem;
  background-size: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-label='Down chevron' class='__arc--c-gibqxe __arc--c-gibqxe-iiyMMbc-css' viewBox='0 0 24 24'%3E%3Crect width='$2' height='$2' fill='none'/%3E%3Cpath d='m.585 7.213 10.983 12.471a1.066 1.066 0 0 0 1.539 0l10.977-12.47a.987.987 0 0 0-.106-1.415l-1.85-1.557a1.028 1.028 0 0 0-1.438.111l-8.164 9.453a.25.25 0 0 1-.38 0L3.98 4.352a1.02 1.02 0 0 0-.696-.346 1 1 0 0 0-.741.238L.693 5.8a.978.978 0 0 0-.107 1.414Z' class='__arc--c-PJLV __arc--c-PJLV-ibwoYNJ-css'/%3E%3C/svg%3E");
}

#form-hint {
  font-size: 12px;
  color: #656a86;
  margin: .25rem 0 0;
}

  #form-container button {
  background: #1f3cd0;
  border: none;
  border-radius: 4px;
  color: #fff;
  height: 40px;
  padding: 0 1rem;
  margin-top: 2rem;
  width: 100%;
  cursor: pointer;
}

#form-container button:hover {
  background: rgb(9 22 120);
}`}</style>
    <div id="form-container">
      <label htmlFor="liveblog-id">Liveblog Id</label>
      <input
        id="liveblog-id"
        type="text"
        value={liveblogId}
        onChange={handleInputChange}
        placeholder="Paste liveblog ID here"
      />
      <label htmlFor="theme-select">Theme</label>
      <select id="theme-select" value={themeId} onChange={handleThemeChange}>
        {TIK_THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>{theme.name}</option>
        ))}
      </select>
      <label htmlFor="liveblog-url">Link URL (optional)</label>
      <input
        id="liveblog-url"
        type="text"
        value={liveblogUrl}
        onChange={handleLiveblogUrlChange}
        placeholder="https://example.com/your-liveblog-article"
      />
      <p id="form-hint">Leave blank to let the teaser link to the liveblog automatically.</p>
      <button onClick={handleButtonClick}>Submit</button>
    </div>
    </>
  );
};

export default TickarooLiveblogTeaserSearch;
