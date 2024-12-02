import { useState } from 'react';
import { useRouter } from 'next/router';
import ModEditor from '../../components/admin/ModEditor';
import CategoryEditor from '../../components/admin/CategoryEditor';
import BackgroundEditor from '../../components/admin/BackgroundEditor';
import { withAuth } from '../../components/admin/withAuth';
import { useAdmin } from '../../hooks/useAdmin';

const AdminPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mods' | 'categories' | 'backgrounds'>('mods');
  const {
    mods,
    categories,
    loading,
    handleModUpdate,
    handleModAdd,
    handleModDelete,
    handleCategoryUpdate,
    handleCategoryAdd,
    handleCategoryDelete,
  } = useAdmin();

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/guanli/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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
              <button
                onClick={() => setActiveTab('backgrounds')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'backgrounds'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                背景管理
              </button>
            </nav>
          </div>

          {/* 内容区域 */}
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === 'mods' && (
              <ModEditor 
                mods={mods}
                categories={categories}
                onUpdate={handleModUpdate}
                onAdd={handleModAdd}
                onDelete={handleModDelete}
              />
            )}
            {activeTab === 'categories' && (
              <CategoryEditor 
                categories={categories}
                onUpdate={handleCategoryUpdate}
                onAdd={handleCategoryAdd}
                onDelete={handleCategoryDelete}
              />
            )}
            {activeTab === 'backgrounds' && <BackgroundEditor />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminPage);
