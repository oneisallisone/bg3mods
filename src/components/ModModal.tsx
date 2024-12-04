import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import { Mod } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatDistance, isValid, parseISO } from 'date-fns';

interface ModModalProps {
  mod: Mod;
  isOpen: boolean;
  onClose: () => void;
}

export const ModModal: React.FC<ModModalProps> = ({ mod, isOpen, onClose }) => {
  const { t } = useTranslation('common');

  const formatUpdateDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Unknown';
      }
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  const getYoutubeVideoId = (url: string) => {
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regex);
    return match && match[7].length === 11 ? match[7] : false;
  };

  const getBilibiliVideoId = (url: string) => {
    const regex = /^.*((bilibili.com\/video\/)|(b23.tv\/))([^#&?]*).*/;
    const match = url.match(regex);
    return match && match[3] ? match[3] : false;
  };

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
              <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all">
                {/* Close Button */}
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mod.name}
                    </Dialog.Title>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {mod.author_name}</span>
                      <span>•</span>
                      <span>Version {mod.version}</span>
                      {mod.last_updated && (
                        <>
                          <span>•</span>
                          <span>
                            Updated {formatUpdateDate(mod.last_updated)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Images */}
                  {mod.images && mod.images.length > 0 && (
                    <div className="relative h-96">
                      <img
                        src={mod.images[0].url}
                        alt={mod.images[0].caption}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Videos */}
                  {mod.videos && mod.videos.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Videos
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {mod.videos.map((video, index) => (
                          <div key={index} className="relative">
                            {video.platform === 'youtube' ? (
                              <iframe
                                className="w-full aspect-video rounded-lg"
                                src={`https://www.youtube.com/embed/${getYoutubeVideoId(video.url)}?enablejsapi=0&origin=${window.location.origin}`}
                                title={video.title || `Video ${index + 1}`}
                                frameBorder="0"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : video.platform === 'bilibili' ? (
                              <iframe
                                className="w-full aspect-video rounded-lg"
                                src={`https://player.bilibili.com/player.html?bvid=${getBilibiliVideoId(video.url)}`}
                                title={video.title || `Video ${index + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {video.title || video.url}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {mod.description}
                    </p>
                  </div>

                  {/* Features */}
                  {mod.features && mod.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Features
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {mod.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {mod.requirements && mod.requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {mod.requirements.map((req, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-300">
                            <a
                              href={req.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {req.name}
                            </a>
                            {req.description && (
                              <p className="mt-1 text-sm">{req.description}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {mod.tags && mod.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mod.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="mt-6 flex justify-end">
                    <a
                      href={mod.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Download
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

export default ModModal;
