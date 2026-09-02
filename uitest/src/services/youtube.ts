/**
 * YouTube Data API v3 Search Service
 */

export interface YouTubeVideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
}

function decodeHtmlEntities(text: string): string {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent || text;
}

export async function searchYouTube(
  query: string,
  apiKeyOverride?: string
): Promise<YouTubeVideoItem[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const apiKey =
    apiKeyOverride?.trim() ||
    import.meta.env.VITE_YOUTUBE_API_KEY?.trim() ||
    (typeof process !== 'undefined' ? (process.env.YOUTUBE_API_KEY as string)?.trim() : '') ||
    '';

  if (!apiKey) {
    throw new Error(
      'Hiányzik a YouTube Data API kulcs! Kérlek add meg a .env fájlban (YOUTUBE_API_KEY=...) vagy add meg alább a teszteléshez.'
    );
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '12');
  url.searchParams.set('q', trimmedQuery);
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error?.message ||
      (response.status === 403
        ? 'A YouTube API kvóta elfogyott, vagy a kulcs nem rendelkezik megfelelő jogosultságokkal (403).'
        : response.status === 400
        ? 'Érvénytelen kérés vagy hibás API kulcs (400).'
        : `YouTube hiba (${response.status}): ${response.statusText}`);
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.map((item: any) => {
    const videoId = item.id?.videoId || '';
    const snippet = item.snippet || {};
    const title = decodeHtmlEntities(snippet.title || 'Névtelen videó');
    const description = decodeHtmlEntities(snippet.description || '');
    const channelTitle = decodeHtmlEntities(snippet.channelTitle || 'Ismeretlen csatorna');
    const thumbnailUrl =
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.default?.url ||
      '';

    return {
      id: videoId,
      title,
      description,
      thumbnailUrl,
      channelTitle,
      publishedAt: snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString('hu-HU') : '',
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });
}
