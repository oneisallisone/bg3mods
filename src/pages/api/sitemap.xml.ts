import { NextApiRequest, NextApiResponse } from 'next'
import { getAllMods, getDb } from '@/lib/db'

const LANGUAGES = ['en', 'zh', 'ja', 'ko']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get host from request headers
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host || process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000'
  const SITE_URL = `${protocol}://${host}`

  try {
    // Get mods
    const mods = await getAllMods()
    console.log(`Found ${mods.length} mods for sitemap`)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
