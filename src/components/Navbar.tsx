import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Navbar = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  
  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale })
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            BG3 Mods
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded ${
                router.locale === 'en' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('zh')}
              className={`px-3 py-1 rounded ${
                router.locale === 'zh' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              中文
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
