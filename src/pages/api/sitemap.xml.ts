import { NextApiRequest, NextApiResponse } from 'next'
import { getAllMods, getDb } from '@/lib/db'

interface ModImage {
  url: string;
  caption?: string;
}

interface ModVideo {
  url: string;
  title?: string;
  platform?: 'youtube' | 'bilibili';
}

interface Mod {
  id: string;
  name: string;
  last_updated: string;
  author_name: string;
  images?: ModImage[];
  videos?: ModVideo[];
}

const LANGUAGES = ['en', 'zh', 'ja', 'ko']

// 转义XML特殊字符
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get host from request headers
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host || process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000'
  const SITE_URL = `${protocol}://${host}`

  try {
    // Get mods
    const mods = await getAllMods() as Mod[]
    console.log(`Found ${mods.length} mods for sitemap`)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${LANGUAGES.map(lang => `
        <url>
          <loc>${SITE_URL}/${lang}</loc>
          ${LANGUAGES.map(l => `
            <xhtml:link 
              rel="alternate" 
              hreflang="${l}" 
              href="${SITE_URL}/${l}"
            />`).join('')}
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      `).join('')}
      
      ${mods.map(mod => `
        <url>
          <loc>${SITE_URL}/mod/${mod.id}</loc>
          ${LANGUAGES.map(lang => `
            <xhtml:link 
              rel="alternate" 
              hreflang="${lang}" 
              href="${SITE_URL}/${lang}/mod/${mod.id}"
            />`).join('')}
          <lastmod>${mod.last_updated.split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
          ${mod.images?.map(image => `
            <image:image>
              <image:loc>${escapeXml(image.url)}</image:loc>
              ${image.caption ? `<image:caption>${escapeXml(image.caption)}</image:caption>` : ''}
            </image:image>
          `).join('')}
          ${mod.videos?.map(video => {
            // Extract video ID and thumbnail for different platforms
            let videoId = '';
            let thumbnailUrl = '';
            let playerUrl = '';
            
            if (video.platform === 'youtube') {
              const youtubeMatch = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
              if (youtubeMatch) {
                videoId = youtubeMatch[1];
                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                playerUrl = `https://www.youtube.com/embed/${videoId}`;
              }
            } else if (video.platform === 'bilibili') {
              const bilibiliMatch = video.url.match(/\/video\/([^/?]+)/);
              if (bilibiliMatch) {
                videoId = bilibiliMatch[1];
                playerUrl = `https://player.bilibili.com/player.html?bvid=${videoId}`;
              }
            }

            return videoId ? `
              <video:video>
                ${thumbnailUrl ? `<video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>` : ''}
                <video:title>${escapeXml(video.title || `Video for ${mod.name}`)}</video:title>
                <video:description>${escapeXml(`Video content for ${mod.name} mod`)}</video:description>
                <video:player_loc>${escapeXml(playerUrl)}</video:player_loc>
                <video:family_friendly>yes</video:family_friendly>
                <video:uploader>${escapeXml(mod.author_name)}</video:uploader>
              </video:video>
            ` : '';
          }).join('')}
        </url>
      `).join('')}
      
      ${LANGUAGES.map(lang => `
        <url>
          <loc>${SITE_URL}/${lang}/about</loc>
          ${LANGUAGES.map(l => `
            <xhtml:link 
              rel="alternate" 
              hreflang="${l}" 
              href="${SITE_URL}/${l}/about"
            />`).join('')}
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
      `).join('')}
    </urlset>`

    res.writeHead(200, {
      'Content-Type': 'application/xml',
      'Content-Length': Buffer.byteLength(sitemap),
      'Cache-Control': 'public, max-age=3600'
    })
    
    res.write(sitemap)
    res.end()
  } catch (error) {
    console.error('Error generating sitemap:', error)
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${SITE_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    </urlset>`
    
    res.writeHead(200, {
      'Content-Type': 'application/xml',
      'Content-Length': Buffer.byteLength(fallbackSitemap)
    })
    
    res.write(fallbackSitemap)
    res.end()
  }
}
