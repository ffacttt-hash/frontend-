
import { apiClient } from "@/lib/api";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

  try {
    const response = await apiClient.getMovies({ 
      limit: 50, 
      sort: "-createdAt",
      featured: true 
    });
    
    const movies = response.success ? response.data.movies : [];

    const feedItems = movies.map((movie) => {
      const movieUrl = `${baseUrl}/movie/${movie.slug || movie._id}`;
      const imageUrl = movie.posterUrl ? `${apiBaseUrl}${movie.posterUrl}` : '';
      const categories = movie.categories?.join(', ') || '';
      const genres = movie.genres?.join(', ') || '';
      
      return `
        <item>
          <title><![CDATA[${movie.title} (${movie.year || 'N/A'})]]></title>
          <link>${movieUrl}</link>
          <guid isPermaLink="true">${movieUrl}</guid>
          <pubDate>${new Date(movie.createdAt).toUTCString()}</pubDate>
          <description><![CDATA[
            ${movie.description || `Watch ${movie.title} online. ${categories ? `Categories: ${categories}.` : ''} ${genres ? `Genres: ${genres}.` : ''}`}
          ]]></description>
          <category><![CDATA[${categories}]]></category>
          ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" />` : ""}
          <author>noreply@vegamovies.com (VegaMovies Team)</author>
          ${movie.rating ? `<rating>${movie.rating}/10</rating>` : ''}
          ${movie.language ? `<language>${movie.language}</language>` : ''}
        </item>
      `;
    }).join("");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" 
           xmlns:atom="http://www.w3.org/2005/Atom"
           xmlns:content="http://purl.org/rss/1.0/modules/content/"
           xmlns:dc="http://purl.org/dc/elements/1.1/">
        <channel>
          <title>VegaMovies - Latest Movies &amp; TV Shows</title>
          <link>${baseUrl}</link>
          <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
          <description>Discover the latest movies and TV shows on VegaMovies. Get comprehensive movie information, reviews, and ratings.</description>
          <language>en-us</language>
          <copyright>Copyright ${new Date().getFullYear()} VegaMovies. All rights reserved.</copyright>
          <managingEditor>noreply@vegamovies.com (VegaMovies Team)</managingEditor>
          <webMaster>noreply@vegamovies.com (VegaMovies Team)</webMaster>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          <pubDate>${new Date().toUTCString()}</pubDate>
          <ttl>60</ttl>
          <image>
            <url>${baseUrl}/logo.png</url>
            <title>VegaMovies</title>
            <link>${baseUrl}</link>
            <width>144</width>
            <height>144</height>
            <description>VegaMovies Logo</description>
          </image>
          <category>Entertainment</category>
          <category>Movies</category>
          <category>TV Shows</category>
          ${feedItems}
        </channel>
      </rss>
    `;

    return new Response(rssFeed, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Return a minimal RSS feed on error
    const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>VegaMovies - Latest Movies</title>
          <link>${baseUrl}</link>
          <description>Latest movies and TV shows on VegaMovies</description>
          <language>en-us</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        </channel>
      </rss>
    `;

    return new Response(errorFeed, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  }
}


