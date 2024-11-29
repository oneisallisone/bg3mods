import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image'
import { Mod } from '@/types/mod'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/number'
import { DownloadIcon, StarIcon, TagIcon, CalendarIcon } from './icons'
import { ModModal } from './ModModal';
import { format, isValid } from 'date-fns';

interface ModCardProps {
  mod: Mod;
}

export const ModCard: React.FC<ModCardProps> = ({ mod }) => {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const latestVersion = mod.versions && mod.versions.length > 0 ? mod.versions[0] : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : t('mod_card.invalid_date');
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1"
        onClick={() => setIsModalOpen(true)}
      >
        {/* 模组封面图 */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
          {mod.screenshots && mod.screenshots.length > 0 ? (
            <img
              src={mod.screenshots[0].thumbnailUrl || mod.screenshots[0].url}
              alt={mod.screenshots[0].caption}
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
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t(`categories.${mod.category}`)}
            </span>
          </div>
        </div>

        {/* 模组信息 */}
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                {mod.name}
              </h3>
              <div className="flex items-center gap-2">
                <a 
                  href={mod.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  {t('download')}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <DownloadIcon className="w-4 h-4" />
                <span>{formatNumber(mod.downloads)} {t('downloads')}</span>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                <span>{mod.rating.toFixed(1)} {t('rating')}</span>
              </div>
              <div className="flex items-center gap-1">
                <TagIcon className="w-4 h-4" />
                <span>v{latestVersion ? latestVersion.version : 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(mod.lastUpdated)}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {mod.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {mod.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 作者和统计 */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="text-gray-500 dark:text-gray-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {mod.author.name}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 dark:text-gray-400 flex items-center" title={t('mod_card.downloads')}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {mod.downloads.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400 flex items-center" title={t('mod_card.rating')}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {mod.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* 底部信息栏 */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(mod.lastUpdated)}
            </div>
            
            {/* 标签 */}
            {mod.tags && mod.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {mod.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
                {mod.tags.length > 2 && (
                  <span className="text-gray-500 dark:text-gray-400">
                    +{mod.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
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
