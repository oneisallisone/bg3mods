import { useState } from 'react';
import { useRouter } from 'next/router';
import ModEditor from '../../components/admin/ModEditor';
import CategoryEditor from '../../components/admin/CategoryEditor';
import { withAuth } from '../../components/admin/withAuth';

const AdminPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mods' | 'categories'>('mods');

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/guanli/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">管理后台</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              退出登录
            </button>
          </div>

          {/* 标签切换 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('mods')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'mods'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Mod管理
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                分类管理
              </button>
            </nav>
          </div>

          {/* 内容区域 */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            {activeTab === 'mods' ? (
              <ModEditor />
            ) : (
              <CategoryEditor />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminPage);
