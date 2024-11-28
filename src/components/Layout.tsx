import Head from 'next/head'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

const Layout = ({
  children,
  title = 'BG3 Mods Navigation',
  description = 'Find the best Baldur\'s Gate 3 mods for your gameplay',
}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>© 2024 BG3 Mods Navigation. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Layout
