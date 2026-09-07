import { TIK_CLIENT_ID } from 'fusion:environment';
import axios from 'axios';

// Server-side prefetch for the Liveblog Teaser widget. Kept as a separate source
// from `tickaroo-liveblog` so the full liveblog and the teaser never share a cache
// key. Unlike the liveblog endpoint, the teaser prefetch returns `{ html }` only
// (no `schema`) — the teaser is a static card, not a LiveBlogPosting, so it emits
// no JSON-LD.
const fetch = async (query) => {
    const liveblogId = query.liveblogId;
    const themeId = query.themeId;
    const response = await axios
        .get('https://cdn.tickaroo.com/api/embed/v4/prefetch/liveblog-teaser.json', { params: { liveblogId, client_id: TIK_CLIENT_ID, themeId } })
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            return null;
        });

    return {
        liveblogId,
        clientId: TIK_CLIENT_ID,
        themeId: themeId,
        ...(response ?? {}),
    };
}

export default {
    fetch,
    params: { liveblogId: 'text', themeId: 'text' },
    ttl: 120
}
