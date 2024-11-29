import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import { Mod } from '@/types/mod';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModModalProps {
  mod: Mod;
  isOpen: boolean;
  onClose: () => void;
}

export const ModModal: React.FC<ModModalProps> = ({ mod, isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const latestVersion = mod.versions?.[0];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex justify-between items-center"
                >
                  <span>{mod.name}</span>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Title>

                {/* 作者信息 */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('mod_card.author')}
                  </h4>
                  <div className="mt-1 flex items-center">
                    <span className="text-gray-900 dark:text-white">{mod.author.name}</span>
                    {mod.author.profile && (
                      <a
                        href={mod.author.profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {t('mod_card.visit_profile')}
                      </a>
                    )}
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('mod_card.downloads')}
                    </h4>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {mod.downloads.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('mod_card.rating')}
                    </h4>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {mod.rating.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('mod_card.version')}
                    </h4>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {latestVersion?.version || t('mod_card.no_version')}
                    </p>
                  </div>
                </div>

                {/* 描述 */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('mod_card.description')}
                  </h4>
                  <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                    {mod.description}
                  </p>
                </div>

                {/* 标签 */}
                {mod.tags && mod.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('mod_card.tags')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {mod.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 依赖项 */}
                {mod.requirements && mod.requirements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('mod_card.requirements')}
                    </h4>
                    <ul className="list-disc list-inside text-gray-900 dark:text-white">
                      {mod.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 下载按钮 */}
                {latestVersion && (
                  <div className="mt-6">
                    <a
                      href={latestVersion.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {t('mod_card.download')}
                    </a>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
