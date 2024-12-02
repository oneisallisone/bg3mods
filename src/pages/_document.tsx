import { Html, Head, Main, NextScript } from 'next/document'
import { useRouter } from 'next/router'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" type="image/png" href="/icons/icon-16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/icons/icon-32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Default meta tags - will be overridden by page-specific ones */}
        <meta name="description" content="Your ultimate guide to Baldur's Gate 3 mods - discover, manage and enjoy mods easily" />
        <meta name="keywords" content="Baldur's Gate 3, BG3, mods, gaming, RPG, modifications" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="BG3 Mods Navigation" />
        <meta property="og:description" content="Your ultimate guide to Baldur's Gate 3 mods - discover, manage and enjoy mods easily" />
        <meta property="og:image" content="/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BG3 Mods Navigation" />
        <meta name="twitter:description" content="Your ultimate guide to Baldur's Gate 3 mods - discover, manage and enjoy mods easily" />
        <meta name="twitter:image" content="/og-image.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
