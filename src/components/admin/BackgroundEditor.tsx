import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Background {
  id: string;
  url: string;
  active: boolean;
  isLocal: boolean;
  originalFormat?: string;
  width?: number;
  height?: number;
  size?: number;
}

const BackgroundEditor = () => {
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载背景图片数据
  useEffect(() => {
    const loadBackgrounds = async () => {
      try {
        setError(null);
        const response = await fetch('/api/backgrounds');
        if (!response.ok) {
          throw new Error('加载背景图片失败');
        }
        const data = await response.json();
        setBackgrounds(data);
      } catch (error) {
        console.error('加载背景图片失败:', error);
        setError('加载背景图片失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadBackgrounds();
  }, []);

  // 格式化文件大小
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', async () => {
        try {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            setBackgrounds(prev => [...prev, data]);
            resolve(data);
          } else {
            let errorMessage = '上传失败';
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.error || errorMessage;
            } catch {
              // 如果无法解析错误信息，使用默认错误信息
            }
            reject(new Error(errorMessage));
          }
        } catch (error) {
          reject(new Error('解析响应失败'));
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
          // 重置文件输入
          const input = document.getElementById('background-upload') as HTMLInputElement;
          if (input) {
            input.value = '';
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误，上传失败'));
        setIsUploading(false);
        setUploadProgress(0);
        // 重置文件输入
        const input = document.getElementById('background-upload') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('上传已取消'));
        setIsUploading(false);
        setUploadProgress(0);
        // 重置文件输入
        const input = document.getElementById('background-upload') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
      });

      xhr.open('POST', '/api/backgrounds/upload');
      xhr.send(formData);
    }).catch((error) => {
      console.error('上传失败:', error);
      alert(error.message || '上传失败，请重试');
    });
  }, []);

  const handleUrlAdd = async () => {
    if (!imageUrl.trim()) {
      setUrlError('请输入图片URL');
      return;
    }

    setIsUploading(true);
    setUrlError('');

    try {
      const response = await fetch('/api/backgrounds/add-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '添加失败');
      }
      
      const data = await response.json();
      setBackgrounds(prev => [...prev, data]);
      setImageUrl('');
      setShowUrlInput(false);
    } catch (error) {
      console.error('添加失败:', error);
      setUrlError(error instanceof Error ? error.message : '添加失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/backgrounds/${id}/toggle`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('操作失败');
      }
      
      setBackgrounds(prev =>
        prev.map(bg => ({
          ...bg,
          active: bg.id === id ? !bg.active : false,
        }))
      );
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败，请重试');
    }
  };

  const deleteBackground = async (id: string) => {
    if (!confirm('确定要删除这张背景图片吗？')) return;

    try {
      const response = await fetch(`/api/backgrounds/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }
      
      setBackgrounds(prev => prev.filter(bg => bg.id !== id));
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">背景图片管理</h2>
        <div className="flex space-x-4">
          {/* URL输入区域 */}
          {showUrlInput ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="输入图片URL"
                className={`border rounded px-3 py-2 w-64 ${
                  urlError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                onClick={handleUrlAdd}
                disabled={isUploading}
                className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? '添加中...' : '添加'}
              </button>
              <button
                onClick={() => {
                  setShowUrlInput(false);
                  setImageUrl('');
                  setUrlError('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowUrlInput(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              添加图片URL
            </button>
          )}

          {/* 本地上传按钮 */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="background-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="background-upload"
              className={`inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? '上传中...' : '本地上传'}
            </label>
            {/* 上传进度条 */}
            {isUploading && (
              <div className="absolute left-0 right-0 -bottom-6">
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* URL错误提示 */}
      {urlError && (
        <div className="text-red-500 text-sm mt-2">{urlError}</div>
      )}

      {/* 加载状态 */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : backgrounds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无背景图片</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backgrounds.map((bg) => (
            <div
              key={bg.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 group">
                <Image
                  src={bg.url.startsWith('/') ? bg.url : `/${bg.url}`}
                  alt="背景图片"
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* 悬浮时显示的操作按钮 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleActive(bg.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        bg.active
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {bg.active ? '当前背景' : '设为背景'}
                    </button>
                    <button
                      onClick={() => deleteBackground(bg.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      格式: {bg.originalFormat?.toUpperCase() || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500">
                      尺寸: {bg.width || '?'} x {bg.height || '?'}
                    </p>
                    <p className="text-sm text-gray-500">
                      大小: {formatFileSize(bg.size)}
                    </p>
                  </div>
                  {/* 当前状态标签 */}
                  {bg.active && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      当前使用
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackgroundEditor;
