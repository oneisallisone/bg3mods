import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Mod } from '@/types/mod';
import { DownloadIcon, StarIcon } from './icons';
import { ModModal } from './ModModal';

interface ModCardProps {
  mod: Mod;
}

export const ModCard: React.FC<ModCardProps> = ({ mod }) => {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1"
        onClick={() => setIsModalOpen(true)}
      >
        {/* 模组封面图 */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
          {mod.images && mod.images.length > 0 ? (
            <img
              src={mod.images[0].url}
              alt={mod.images[0].caption || mod.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* 分类标签 */}
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t(`categories.${mod.category}`)}
            </span>
          </div>
        </div>

        {/* 模组信息 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {mod.name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {mod.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <DownloadIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{formatNumber(mod.downloads || 0)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">{(mod.rating || 0).toFixed(1)}</span>
              </div>
            </div>
            
            <a 
              href={mod.downloadUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t('download')}
            </a>
          </div>

          {/* Tags */}
          {Array.isArray(mod.tags) && mod.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {mod.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
              {mod.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{mod.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <ModModal
        mod={mod}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ModCard;
