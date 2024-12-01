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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="relative pb-16">
                  <div className="sm:flex sm:items-start">
                    {/* 模组信息 */}
                    <div className="mt-3 sm:ml-4 sm:mt-0 text-left flex-1">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex justify-between items-center"
                      >
                        <span>{mod.name}</span>
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
                    </div>
                  </div>

                  {/* 下载按钮 - 固定在右下角 */}
                  <div className="absolute bottom-0 right-0">
                    <a
                      href={latestVersion?.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[200px]"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {t('mod_card.download')} v{latestVersion?.version}
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
