import { useState } from 'react';
import { Mod, Category, ModImage, ModVideo, ModRequirement } from '../../types';
import ImageUploader from './ImageUploader';

interface EditableFields {
  name: string;
  description: string;
  version: string;
  download_url: string;
  author_name: string;
  author_url: string;
  category: string;
  tags: string[];
  images: ModImage[];
  videos: ModVideo[];
  requirements: ModRequirement[];
  features: string[];
}

interface ModEditorProps {
  mods: Mod[];
  categories: Category[];
  onUpdate: (mod: Mod) => Promise<Mod | null>;
  onAdd: (mod: Partial<Mod>) => Promise<Mod | null>;
  onDelete: (modId: string) => Promise<void>;
}

const ModEditor = ({ mods = [], categories = [], onUpdate, onAdd, onDelete }: ModEditorProps) => {
  const [editingMod, setEditingMod] = useState<Mod | null>(null);
  const [newMod, setNewMod] = useState<Partial<Mod>>({
    images: [],
    tags: [],
    downloads: 0,
    rating: 0,
    requirements: [],
    features: [],
    videos: [],
    author_name: '',
    author_url: ''
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingField, setEditingField] = useState<keyof EditableFields | null>(null);
  const [tempFieldValue, setTempFieldValue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importStatus, setImportStatus] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    errors?: string[];
  }>({
    status: 'idle',
    message: ''
  });
  const [filters, setFilters] = useState({
    category: 'all',
    hasImages: false,
    hasVideos: false,
    hasRequirements: false
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'name' as keyof Mod,
    direction: 'asc' as 'asc' | 'desc'
  });

  const handleBulkImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus({
        status: 'loading',
        message: '正在读取文件...'
      });

      const fileContent = await file.text();
      let jsonData;
      
      try {
        jsonData = JSON.parse(fileContent);
      } catch (error) {
        throw new Error('无效的JSON格式');
      }

      setImportStatus({
        status: 'loading',
        message: '正在导入...'
      });

      const response = await fetch('/api/mods/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw {
          message: result.message || '导入失败',
          errors: result.errors
        };
      }

      // 重新获取最新的mods列表
      const modsResponse = await fetch('/api/mods');
      const modsData = await modsResponse.json();
      
      if (Array.isArray(modsData)) {
        // 由于状态管理已移除，无法直接更新mods
        // 请确保父组件会重新渲染ModEditor并传递最新的mods
      }

      setImportStatus({
        status: 'success',
        message: result.message || '导入成功'
      });

      // 3秒后清除状态消息
      setTimeout(() => {
        setImportStatus({
          status: 'idle',
          message: ''
        });
      }, 3000);

    } catch (error) {
      console.error('导入错误:', error);
      setImportStatus({
        status: 'error',
        message: error instanceof Error ? error.message : '导入失败',
        errors: (error as { errors?: string[] })?.errors || []
      });
    }
  };

  const renderImportStatus = () => {
    if (importStatus.status === 'idle') return null;

    const statusColors = {
      loading: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800'
    };

    return (
      <div className="mb-4">
        <div className={`p-4 rounded-lg ${statusColors[importStatus.status]}`}>
          <p className="font-medium">{importStatus.message}</p>
          {importStatus.errors && importStatus.errors.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">错误详情：</p>
              <ul className="list-disc list-inside">
                {importStatus.errors.map((error, index) => (
                  <li key={index} className="ml-4">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleAdd = async () => {
    try {
      const newId = Math.random().toString(36).substr(2, 9);
      const modToAdd = {
        ...newMod,
        id: newId,
        downloads: 0,
        rating: 0,
        version: '1.0.0',
        last_updated: new Date().toISOString().split('T')[0],
        author_name: newMod.author_name || 'Unknown',
        author_url: newMod.author_url || ''
      } as Mod;

      const response = await fetch('/api/mods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modToAdd),
      });

      if (!response.ok) throw new Error('Failed to add mod');

      const addedMod = await response.json();
      onAdd(addedMod);
      setNewMod({
        images: [],
        tags: [],
        downloads: 0,
        rating: 0,
        requirements: [],
        features: [],
        videos: [],
        author_name: '',
        author_url: ''
      });
    } catch (error) {
      console.error('Error adding mod:', error);
      alert('添加失败，请重试');
    }
  };

  const handleDelete = async (modId: string) => {
    if (!confirm('确定要删除这个Mod吗？')) return;

    try {
      const response = await fetch(`/api/mods/${modId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete mod');

      onDelete(modId);
    } catch (error) {
      console.error('Error deleting mod:', error);
      alert('删除失败，请重试');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus({ status: 'loading', message: 'Processing...' });
    
    try {
      if (editingMod) {
        const updated = await onUpdate({
          ...editingMod,
          ...tempFieldValue
        });
        if (updated) {
          setEditingMod(null);
          setTempFieldValue(null);
          setEditingField(null);
          setImportStatus({ status: 'success', message: 'Mod updated successfully' });
        } else {
          setImportStatus({ 
            status: 'error', 
            message: 'Failed to update mod'
          });
        }
      } else {
        const result = await onAdd(newMod);
        if (result) {
          setNewMod({
            images: [],
            tags: [],
            downloads: 0,
            rating: 0,
            requirements: [],
            features: [],
            videos: [],
            author_name: '',
            author_url: ''
          });
          setImportStatus({ status: 'success', message: 'Mod added successfully' });
        } else {
          setImportStatus({ 
            status: 'idle', 
            message: '' 
          });
        }
      }
    } catch (error) {
      console.error('Error submitting mod:', error);
      setImportStatus({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  };

  const handleSave = async (mod: Mod) => {
    try {
      const modToSave = {
        ...mod,
        author_name: mod.author_name || '',
        author_url: mod.author_url || ''
      };

      const response = await fetch(`/api/mods/${mod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modToSave),
      });

      if (!response.ok) throw new Error('Failed to update mod');

      const updatedMod = await response.json();
      onUpdate(updatedMod);
      setEditingMod(null);
    } catch (error) {
      console.error('Error saving mod:', error);
      alert('保存失败，请重试');
    }
  };

  const filteredMods = (mods || []).filter(mod => {
    // 分类筛选
    if (filters.category !== 'all' && mod.category !== filters.category) {
      return false;
    }

    // 特性筛选
    if (filters.hasImages && (!mod.images || mod.images.length === 0)) {
      return false;
    }
    if (filters.hasVideos && (!mod.videos || mod.videos.length === 0)) {
      return false;
    }
    if (filters.hasRequirements && (!mod.requirements || mod.requirements.length === 0)) {
      return false;
    }

    // 搜索词筛选
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        mod.name.toLowerCase().includes(searchLower) ||
        mod.description?.toLowerCase().includes(searchLower) ||
        mod.author_name.toLowerCase().includes(searchLower) ||
        mod.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        mod.features?.some(feature => feature.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const sortedAndFilteredMods = [...filteredMods].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];
    
    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const handleEdit = (mod: Mod) => {
    // 确保所有数组属性都有初始值
    setEditingMod({
      ...mod,
      images: mod.images || [],
      videos: mod.videos || [],
      requirements: mod.requirements || [],
      features: mod.features || [],
      tags: mod.tags || [],
      author_name: mod.author_name || '',
      author_url: mod.author_url || ''
    });
  };

  // 处理图片编辑
  const handleAddImage = (mod: Mod, imageUrl: string) => {
    const newImage: ModImage = {
      url: imageUrl,
      caption: tempFieldValue?.caption || ''
    };
    
    const updatedImages = [...(mod.images || []), newImage];
    setEditingMod({
      ...mod,
      images: updatedImages
    });
    setTempFieldValue(null);
  };

  const handleRemoveImage = (mod: Mod, index: number) => {
    const updatedImages = mod.images.filter((_, i) => i !== index);
    setEditingMod({
      ...mod,
      images: updatedImages
    });
  };

  // 处理视频编辑
  const handleAddVideo = (mod: Mod) => {
    const newVideo: ModVideo = {
      url: tempFieldValue.url || '',
      title: tempFieldValue.title || '',
      platform: tempFieldValue.platform || 'other'
    };
    
    const updatedVideos = [...(mod.videos || []), newVideo];
    setEditingMod({
      ...mod,
      videos: updatedVideos
    });
    setTempFieldValue(null);
    setEditingField(null);
  };

  const handleRemoveVideo = (mod: Mod, index: number) => {
    const updatedVideos = mod.videos.filter((_, i) => i !== index);
    setEditingMod({
      ...mod,
      videos: updatedVideos
    });
  };

  // 处理前置要求编辑
  const handleAddRequirement = (mod: Mod) => {
    const newRequirement: ModRequirement = {
      name: tempFieldValue.name || '',
      url: tempFieldValue.url || '',
      description: tempFieldValue.description || ''
    };
    
    const updatedRequirements = [...(mod.requirements || []), newRequirement];
    setEditingMod({
      ...mod,
      requirements: updatedRequirements
    });
    setTempFieldValue(null);
    setEditingField(null);
  };

  const handleRemoveRequirement = (mod: Mod, index: number) => {
    const updatedRequirements = mod.requirements.filter((_, i) => i !== index);
    setEditingMod({
      ...mod,
      requirements: updatedRequirements
    });
  };

  const initializeEditField = (field: keyof EditableFields) => {
    setEditingField(field);
    // 根据不同字段类型设置不同的初始值
    switch (field) {
      case 'images':
        setTempFieldValue({ url: '', caption: '' });
        break;
      case 'videos':
        setTempFieldValue({ url: '', title: '', platform: 'youtube' });
        break;
      case 'requirements':
        setTempFieldValue({ name: '', url: '', description: '' });
        break;
    }
  };

  const handleSort = (field: keyof Mod) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 排序按钮组件
  const SortButton = ({ field, children }: { field: keyof Mod; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className={`px-3 py-1 text-sm font-medium rounded ${
        sortConfig.field === field
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
      {sortConfig.field === field && (
        <span className="ml-1">
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  const renderSearchAndFilters = () => (
    <div className="mb-6 space-y-4">
      {/* 搜索框 */}
      <div>
        <input
          type="text"
          placeholder="搜索Mod名称、描述、作者..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* 筛选器 */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">所有分类</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={filters.hasImages}
            onChange={(e) => setFilters({ ...filters, hasImages: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2">有图片</span>
        </label>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={filters.hasVideos}
            onChange={(e) => setFilters({ ...filters, hasVideos: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2">有视频</span>
        </label>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={filters.hasRequirements}
            onChange={(e) => setFilters({ ...filters, hasRequirements: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2">有前置要求</span>
        </label>
      </div>

      {/* 排序按钮组 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 self-center mr-2">排序：</span>
        <SortButton field="name">名称</SortButton>
        <SortButton field="downloads">下载量</SortButton>
        <SortButton field="rating">评分</SortButton>
        <SortButton field="last_updated">更新时间</SortButton>
      </div>

      {/* 显示筛选结果数量 */}
      <div className="text-sm text-gray-600">
        找到 {sortedAndFilteredMods.length} 个Mod
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 导入状态显示 */}
      {renderImportStatus()}

      {/* 批量导入按钮 */}
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".json"
          onChange={handleBulkImport}
          className="hidden"
          id="bulk-import"
        />
        <label
          htmlFor="bulk-import"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          批量导入
        </label>
        <a
          href="/backup/mod_template.json"
          download
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          下载模板
        </a>
      </div>

      {/* 类目筛选 */}
      <div className="mb-4">
        <select
          className="border rounded p-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">所有类目</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* 添加新Mod */}
      <div className="mb-8 p-4 border rounded">
        <h3 className="text-lg font-semibold mb-4">添加新Mod</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 基本信息 */}
          <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Mod名称"
              className="border rounded p-2"
              value={newMod.name || ''}
              onChange={e => setNewMod({...newMod, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="版本号"
              className="border rounded p-2"
              value={newMod.version || ''}
              onChange={e => setNewMod({...newMod, version: e.target.value})}
            />
            <textarea
              placeholder="Mod描述"
              className="border rounded p-2 col-span-2"
              value={newMod.description || ''}
              onChange={e => setNewMod({...newMod, description: e.target.value})}
              rows={3}
            />
          </div>
          <select
            className="border rounded p-2"
            value={newMod.category || ''}
            onChange={e => setNewMod({...newMod, category: e.target.value})}
          >
            <option value="">选择类目</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="下载链接"
            className="border rounded p-2"
            value={newMod.download_url || ''}
            onChange={e => setNewMod({...newMod, download_url: e.target.value})}
          />

          {/* 作者信息 */}
          <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="作者名称"
              className="border rounded p-2"
              value={newMod.author_name || ''}
              onChange={e => setNewMod({
                ...newMod,
                author_name: e.target.value,
                author_url: newMod.author_url || ''
              })}
            />
            <input
              type="text"
              placeholder="作者主页"
              className="border rounded p-2"
              value={newMod.author_url || ''}
              onChange={e => setNewMod({
                ...newMod,
                author_name: newMod.author_name || '',
                author_url: e.target.value
              })}
            />
          </div>

          {/* 特性和标签 */}
          <div className="col-span-2">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">特性</label>
              <div className="flex flex-wrap gap-2">
                {newMod.features?.map((feature, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                    <span>{feature}</span>
                    <button
                      onClick={() => {
                        const newFeatures = [...(newMod.features || [])];
                        newFeatures.splice(index, 1);
                        setNewMod({...newMod, features: newFeatures});
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="添加特性"
                  className="border rounded p-1 text-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setNewMod({
                        ...newMod,
                        features: [...(newMod.features || []), e.currentTarget.value]
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
              <div className="flex flex-wrap gap-2">
                {newMod.tags?.map((tag, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                    <span>{tag}</span>
                    <button
                      onClick={() => {
                        const newTags = [...(newMod.tags || [])];
                        newTags.splice(index, 1);
                        setNewMod({...newMod, tags: newTags});
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="添加标签"
                  className="border rounded p-1 text-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setNewMod({
                        ...newMod,
                        tags: [...(newMod.tags || []), e.currentTarget.value]
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* 前置要求 */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">前置要求</label>
            <div className="space-y-2">
              {newMod.requirements?.map((req, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    placeholder="名称"
                    className="border rounded p-2 flex-1"
                    value={req.name}
                    onChange={e => {
                      const newReqs = [...(newMod.requirements || [])];
                      newReqs[index] = {...newReqs[index], name: e.target.value};
                      setNewMod({...newMod, requirements: newReqs});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="链接"
                    className="border rounded p-2 flex-1"
                    value={req.url}
                    onChange={e => {
                      const newReqs = [...(newMod.requirements || [])];
                      newReqs[index] = {...newReqs[index], url: e.target.value};
                      setNewMod({...newMod, requirements: newReqs});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="描述"
                    className="border rounded p-2 flex-1"
                    value={req.description || ''}
                    onChange={e => {
                      const newReqs = [...(newMod.requirements || [])];
                      newReqs[index] = {...newReqs[index], description: e.target.value};
                      setNewMod({...newMod, requirements: newReqs});
                    }}
                  />
                  <button
                    onClick={() => {
                      const newReqs = [...(newMod.requirements || [])];
                      newReqs.splice(index, 1);
                      setNewMod({...newMod, requirements: newReqs});
                    }}
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setNewMod({
                    ...newMod,
                    requirements: [
                      ...(newMod.requirements || []),
                      { name: '', url: '', description: '' }
                    ]
                  });
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                + 添加前置要求
              </button>
            </div>
          </div>

          {/* 图片 */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">图片</label>
            <div className="space-y-2">
              {newMod.images?.map((image, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    placeholder="图片URL"
                    className="border rounded p-2 flex-1"
                    value={image.url}
                    onChange={e => {
                      const newImages = [...(newMod.images || [])];
                      newImages[index] = {...newImages[index], url: e.target.value};
                      setNewMod({...newMod, images: newImages});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="图片说明"
                    className="border rounded p-2 flex-1"
                    value={image.caption || ''}
                    onChange={e => {
                      const newImages = [...(newMod.images || [])];
                      newImages[index] = {...newImages[index], caption: e.target.value};
                      setNewMod({...newMod, images: newImages});
                    }}
                  />
                  <button
                    onClick={() => {
                      const newImages = [...(newMod.images || [])];
                      newImages.splice(index, 1);
                      setNewMod({...newMod, images: newImages});
                    }}
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setNewMod({
                    ...newMod,
                    images: [
                      ...(newMod.images || []),
                      { url: '', caption: '' }
                    ]
                  });
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                + 添加图片
              </button>
            </div>
          </div>

          {/* 视频 */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">视频</label>
            <div className="space-y-2">
              {newMod.videos?.map((video, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    placeholder="视频URL"
                    className="border rounded p-2 flex-1"
                    value={video.url}
                    onChange={e => {
                      const newVideos = [...(newMod.videos || [])];
                      newVideos[index] = {...newVideos[index], url: e.target.value};
                      setNewMod({...newMod, videos: newVideos});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="视频标题"
                    className="border rounded p-2 flex-1"
                    value={video.title || ''}
                    onChange={e => {
                      const newVideos = [...(newMod.videos || [])];
                      newVideos[index] = {...newVideos[index], title: e.target.value};
                      setNewMod({...newMod, videos: newVideos});
                    }}
                  />
                  <select
                    className="border rounded p-2"
                    value={video.platform}
                    onChange={e => {
                      const newVideos = [...(newMod.videos || [])];
                      const platform = e.target.value as 'youtube' | 'bilibili' | 'other';
                      newVideos[index] = {...newVideos[index], platform};
                      setNewMod({...newMod, videos: newVideos});
                    }}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="bilibili">Bilibili</option>
                    <option value="other">其他</option>
                  </select>
                  <button
                    onClick={() => {
                      const newVideos = [...(newMod.videos || [])];
                      newVideos.splice(index, 1);
                      setNewMod({...newMod, videos: newVideos});
                    }}
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setNewMod({
                    ...newMod,
                    videos: [
                      ...(newMod.videos || []),
                      { url: '', title: '', platform: 'youtube' }
                    ]
                  });
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                + 添加视频
              </button>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="col-span-2 flex justify-end">
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
            >
              添加Mod
            </button>
          </div>
        </div>
      </div>

      {/* Mods列表 */}
      <div className="grid grid-cols-1 gap-4">
        {renderSearchAndFilters()}
        {sortedAndFilteredMods.map(mod => (
          <div key={mod.id} className="border rounded p-4">
            {editingMod?.id === mod.id ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  className="border rounded p-2"
                  value={editingMod.name}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    name: e.target.value
                  })}
                />
                <input
                  type="text"
                  className="border rounded p-2"
                  placeholder="版本号"
                  value={editingMod.version}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    version: e.target.value
                  })}
                />
                <textarea
                  className="border rounded p-2 col-span-2"
                  value={editingMod.description}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    description: e.target.value
                  })}
                  rows={3}
                />
                <select
                  className="border rounded p-2"
                  value={editingMod.category}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    category: e.target.value
                  })}
                >
                  <option value="">选择类目</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="border rounded p-2"
                  placeholder="下载链接"
                  value={editingMod.download_url}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    download_url: e.target.value
                  })}
                />
                <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    className="border rounded p-2"
                    placeholder="作者名称"
                    value={editingMod.author_name || ''}
                    onChange={e => setEditingMod({
                      ...editingMod,
                      author_name: e.target.value,
                      author_url: editingMod.author_url || ''
                    })}
                  />
                  <input
                    type="text"
                    className="border rounded p-2"
                    placeholder="作者主页"
                    value={editingMod.author_url || ''}
                    onChange={e => setEditingMod({
                      ...editingMod,
                      author_name: editingMod.author_name || '',
                      author_url: e.target.value
                    })}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(editingMod)}
                    className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingMod(null)}
                    className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">图片</h4>
                  {editingField === 'images' ? (
                    <div className="space-y-4">
                      <ImageUploader
                        onImageUpload={(url) => handleAddImage(editingMod, url)}
                        onUrlSubmit={(url) => handleAddImage(editingMod, url)}
                      />
                      <input
                        type="text"
                        placeholder="图片描述"
                        className="border rounded p-2 w-full"
                        value={tempFieldValue?.caption || ''}
                        onChange={e => setTempFieldValue({...tempFieldValue, caption: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {(editingMod.images || []).map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={image.caption || ''}
                              className="w-full h-32 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-sm text-center p-2">
                                {image.caption}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => initializeEditField('images')}
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    >
                      编辑图片
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">视频</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(editingMod.videos || []).map((video, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                          {video.title}
                        </a>
                        <button
                          onClick={() => handleRemoveVideo(editingMod, index)}
                          className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                    {editingField === 'videos' ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="视频链接"
                          className="border rounded p-2"
                          value={tempFieldValue?.url || ''}
                          onChange={e => setTempFieldValue({...tempFieldValue, url: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="视频标题"
                          className="border rounded p-2"
                          value={tempFieldValue?.title || ''}
                          onChange={e => setTempFieldValue({...tempFieldValue, title: e.target.value})}
                        />
                        <select
                          className="border rounded p-2"
                          value={tempFieldValue?.platform || 'youtube'}
                          onChange={e => setTempFieldValue({...tempFieldValue, platform: e.target.value as 'youtube' | 'bilibili' | 'other'})}
                        >
                          <option value="youtube">YouTube</option>
                          <option value="bilibili">Bilibili</option>
                          <option value="other">其他</option>
                        </select>
                        <button
                          onClick={() => handleAddVideo(editingMod)}
                          className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
                        >
                          添加视频
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => initializeEditField('videos')}
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                      >
                        编辑视频
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">前置要求</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(editingMod.requirements || []).map((req, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <a href={req.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                          {req.name}
                        </a>
                        <button
                          onClick={() => handleRemoveRequirement(editingMod, index)}
                          className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                    {editingField === 'requirements' ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="要求名称"
                          className="border rounded p-2"
                          value={tempFieldValue?.name || ''}
                          onChange={e => setTempFieldValue({...tempFieldValue, name: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="要求链接"
                          className="border rounded p-2"
                          value={tempFieldValue?.url || ''}
                          onChange={e => setTempFieldValue({...tempFieldValue, url: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="要求描述"
                          className="border rounded p-2"
                          value={tempFieldValue?.description || ''}
                          onChange={e => setTempFieldValue({...tempFieldValue, description: e.target.value})}
                        />
                        <button
                          onClick={() => handleAddRequirement(editingMod)}
                          className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
                        >
                          添加要求
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => initializeEditField('requirements')}
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                      >
                        编辑要求
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">特性</h4>
                  <div className="flex flex-wrap gap-2">
                    {(editingMod.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                        <span>{feature}</span>
                        <button
                          onClick={() => {
                            const newFeatures = [...(editingMod.features || [])];
                            newFeatures.splice(index, 1);
                            setEditingMod({...editingMod, features: newFeatures});
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="添加特性"
                      className="border rounded p-1 text-sm"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          setEditingMod({
                            ...editingMod,
                            features: [...(editingMod.features || []), e.currentTarget.value]
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {(editingMod.tags || []).map((tag, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                        <span>{tag}</span>
                        <button
                          onClick={() => {
                            const newTags = [...(editingMod.tags || [])];
                            newTags.splice(index, 1);
                            setEditingMod({...editingMod, tags: newTags});
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="添加标签"
                      className="border rounded p-1 text-sm"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          setEditingMod({
                            ...editingMod,
                            tags: [...(editingMod.tags || []), e.currentTarget.value]
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleSave(editingMod)}
                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingMod(null)}
                    className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{mod.name}</h3>
                    <p className="text-gray-600 text-sm">版本: {mod.version}</p>
                    <p className="text-gray-700 mt-2">{mod.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(mod)}
                      className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(mod.id)}
                      className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">基本信息</h4>
                    <ul className="mt-2 space-y-1">
                      <li>分类: {categories.find(c => c.id === mod.category)?.name || mod.category}</li>
                      <li>
                        作者: {mod.author_name}
                        {mod.author_url && (
                          <a href={mod.author_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:text-blue-600">
                            主页
                          </a>
                        )}
                      </li>
                      <li>下载量: {mod.downloads}</li>
                      <li>评分: {mod.rating}</li>
                      <li>最后更新: {mod.last_updated}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">下载</h4>
                    <div className="mt-2">
                      <a href={mod.download_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                        下载链接
                      </a>
                    </div>
                  </div>
                </div>

                {mod.features && mod.features.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">特性</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mod.features.map((feature, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {mod.tags && mod.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">标签</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mod.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {mod.requirements && mod.requirements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">前置要求</h4>
                    <ul className="mt-2 space-y-2">
                      {mod.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <a href={req.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                            {req.name}
                          </a>
                          {req.description && (
                            <span className="ml-2 text-gray-600">- {req.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 图片预览 */}
                {mod.images && mod.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">图片预览</h4>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mod.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={image.caption || ''}
                            className="w-full h-32 object-cover rounded"
                          />
                          {image.caption && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-sm text-center p-2">
                                {image.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 视频链接 */}
                {mod.videos && mod.videos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">视频演示</h4>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mod.videos.map((video, index) => (
                        <a
                          key={index}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-2xl mr-3">
                            {video.platform === 'youtube' ? '🎬' : 
                             video.platform === 'bilibili' ? '📺' : '🎥'}
                          </span>
                          <div>
                            <div className="font-medium text-blue-600 hover:text-blue-800">
                              {video.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {video.platform === 'youtube' ? 'YouTube' : 
                               video.platform === 'bilibili' ? 'Bilibili' : '其他平台'}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModEditor;
