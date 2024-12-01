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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 text-sm"
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
          <div className="absolute top-1 right-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t(`categories.${mod.category}`)}
            </span>
          </div>
        </div>

        {/* 模组信息 */}
        <div className="p-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {mod.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-0.5">
                  <DownloadIcon className="w-3 h-3" />
                  <span>{formatNumber(mod.downloads)}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-3 h-3" />
                  <span>{mod.rating.toFixed(1)}</span>
                </div>
              </div>
              <a 
                href={mod.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-2 py-0.5 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {t('download')}
              </a>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {mod.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {mod.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
              {mod.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{mod.tags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* 作者 */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {mod.author.name}
            </div>
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
