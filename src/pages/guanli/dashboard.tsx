import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ModEditor from '../../components/admin/ModEditor';
import CategoryEditor from '../../components/admin/CategoryEditor';
import type { Mod, Category } from '../../types';

interface DashboardProps {
  categories: Category[];
  mods: Mod[];
  activeTab: 'mods' | 'categories';
  setActiveTab: (tab: 'mods' | 'categories') => void;
  handleModUpdate: (mod: Mod) => Promise<Mod | null>;
  handleModAdd: (mod: Partial<Mod>) => Promise<Mod | null>;
  handleModDelete: (modId: string) => Promise<void>;
  handleCategoryUpdate: (category: Category) => Promise<void>;
  handleCategoryAdd: (category: Category) => Promise<void>;
  handleCategoryDelete: (categoryId: string) => Promise<void>;
}

const Dashboard = ({ 
  categories, 
  mods, 
  activeTab, 
  setActiveTab,
  handleModUpdate,
  handleModAdd,
  handleModDelete,
  handleCategoryUpdate,
  handleCategoryAdd,
  handleCategoryDelete 
}: DashboardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查是否已登录
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/guanli/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/guanli/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>管理后台</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">BG3 Mods 管理后台</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <button
                    onClick={() => setActiveTab('mods')}
                    className={`${
                      activeTab === 'mods'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Mods管理
                  </button>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`${
                      activeTab === 'categories'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    分类管理
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'categories' ? (
            <CategoryEditor 
              categories={categories}
              onUpdate={handleCategoryUpdate}
              onAdd={handleCategoryAdd}
              onDelete={handleCategoryDelete}
            />
          ) : (
            <ModEditor 
              mods={mods}
              categories={categories}
              onUpdate={handleModUpdate}
              onAdd={handleModAdd}
              onDelete={handleModDelete}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
