import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Mod } from '../types';
import { DownloadIcon, StarIcon } from './icons';
import { ModModal } from './ModModal';
import Image from 'next/image';

interface ModCardProps {
  mod: Mod;
}

export const ModCard: React.FC<ModCardProps> = ({ mod }) => {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg 
                   transition-all duration-200 cursor-pointer hover:-translate-y-1 h-full flex flex-col"
        onClick={() => setIsModalOpen(true)}
      >
        {/* 封面图区域 - 固定16:9比例 */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
          {mod.images && mod.images.length > 0 && !imageError ? (
            <img
              src={mod.images[0].url}
              alt={mod.images[0].caption || mod.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* 分类标签 */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                           bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t(`categories.${mod.category}`)}
            </span>
          </div>

          {/* 评分和下载量 */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <div className="flex items-center gap-3 bg-black/50 rounded-full px-3 py-1">
              <div className="flex items-center gap-1">
                <DownloadIcon className="w-3.5 h-3.5 text-gray-200" />
                <span className="text-xs font-medium text-gray-200">{formatNumber(mod.downloads || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-medium text-gray-200">{(mod.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {mod.name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow">
            {mod.description}
          </p>

          {/* 标签和下载按钮 */}
          <div className="mt-auto">
            {/* 标签 */}
            {Array.isArray(mod.tags) && mod.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {mod.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 
                             text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {mod.tags.length > 3 && (
                  <span className="text-xs text-gray-500 px-1">
                    +{mod.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* 下载按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(mod.download_url, '_blank');
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
                         transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              {t('mod_card.download')}
            </button>
          </div>
        </div>
      </div>

      {/* 详情模态框 */}
      <ModModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mod={mod}
      />
    </>
  );
};

export default ModCard;
