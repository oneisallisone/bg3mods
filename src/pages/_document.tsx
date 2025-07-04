import { Html, Head, Main, NextScript } from 'next/document'
import { useRouter } from 'next/router'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-adsense-account" content="ca-pub-6706678412893581" />
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
        
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6706678412893581"
                crossOrigin="anonymous"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div style={{ display: 'none' }}>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-D2CQEFDB12"></script>
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D2CQEFDB12');
            `
          }} />
        </div>
      </body>
    </Html>
  )
}
