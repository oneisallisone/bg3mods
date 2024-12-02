import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  modifiedTime?: string;
  publishedTime?: string;
  category?: string;
  keywords?: string[];
}

export default function SEO({ 
  title = 'BG3 Mods Navigation',
  description = 'Your ultimate guide to Baldur\'s Gate 3 mods - discover, manage and enjoy mods easily',
  image = '/og-image.jpg',
  article = false,
  modifiedTime,
  publishedTime,
  category,
  keywords = ['Baldur\'s Gate 3', 'BG3', 'mods', 'gaming', 'RPG', 'modifications']
}: SEOProps) {
  const router = useRouter()
  const { locale } = router

  const canonicalUrl = `https://bg3mods.com${router.asPath}`
  
  // Adjust title based on locale and include the brand name
  const localizedTitle = {
    en: `${title} | BG3 Mods Navigation`,
    zh: `${title} | BG3模组导航`,
    ja: `${title} | BG3モッド案内`,
    ko: `${title} | BG3 모드 네비게이션`
  }[locale || 'en']

  return (
    <Head>
      <title>{localizedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language alternatives */}
      <link rel="alternate" href={`https://bg3mods.com${router.asPath}`} hrefLang="x-default" />
      <link rel="alternate" href={`https://bg3mods.com/en${router.asPath}`} hrefLang="en" />
      <link rel="alternate" href={`https://bg3mods.com/zh${router.asPath}`} hrefLang="zh-CN" />
      <link rel="alternate" href={`https://bg3mods.com/ja${router.asPath}`} hrefLang="ja" />
      <link rel="alternate" href={`https://bg3mods.com/ko${router.asPath}`} hrefLang="ko" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:locale" content={locale} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="BG3 Mods Navigation" />
      <meta property="og:title" content={localizedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime} />
          <meta property="article:section" content={category} />
          {keywords.map((keyword) => (
            <meta property="article:tag" content={keyword} key={keyword} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={localizedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      {modifiedTime && <meta name="last-modified" content={modifiedTime} />}
    </Head>
  )
}
