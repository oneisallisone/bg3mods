import { useState, useEffect } from 'react';
import { Mod, Category, ModImage, ModVideo, ModRequirement } from '../../types/mod';
import ImageUploader from './ImageUploader';

interface EditableFields {
  images: ModImage[];
  videos: ModVideo[];
  requirements: ModRequirement[];
}

const ModEditor = () => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingMod, setEditingMod] = useState<Mod | null>(null);
  const [newMod, setNewMod] = useState<Partial<Mod>>({
    images: [],
    videos: [],
    requirements: [],
    features: [],
    tags: []
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingField, setEditingField] = useState<keyof EditableFields | null>(null);
  const [tempFieldValue, setTempFieldValue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    hasImages: false,
    hasVideos: false,
    hasRequirements: false
  });

  // 添加排序功能
  const [sortConfig, setSortConfig] = useState({
    field: 'name' as keyof Mod,
    direction: 'asc' as 'asc' | 'desc'
  });

  useEffect(() => {
    // 从API获取数据
    const fetchData = async () => {
      try {
        // 获取分类数据
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // 获取Mods数据
        const modsResponse = await fetch('/api/mods');
        if (!modsResponse.ok) throw new Error('Failed to fetch mods');
        const modsData = await modsResponse.json();
        setMods(modsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (mod: Mod) => {
    try {
      const response = await fetch(`/api/mods/${mod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mod),
      });

      if (!response.ok) throw new Error('Failed to update mod');

      const updatedMod = await response.json();
      const updatedMods = mods.map(m => 
        m.id === updatedMod.id ? updatedMod : m
      );
      setMods(updatedMods);
      setEditingMod(null);
    } catch (error) {
      console.error('Error saving mod:', error);
      alert('保存失败，请重试');
    }
  };

  const handleAdd = async () => {
    if (!newMod.name || !newMod.description || !newMod.category) {
      alert('请填写完整的Mod信息');
      return;
    }

    try {
      const newId = Math.random().toString(36).substr(2, 9);
      const modToAdd = {
        ...newMod,
        id: newId,
        downloads: 0,
        rating: 0,
        version: '1.0.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        author: {
          name: newMod.author?.name || 'Unknown',
          url: newMod.author?.url || ''
        },
        images: [],
        videos: [],
        requirements: [],
        features: [],
        tags: []
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
      setMods([...mods, addedMod]);
      setNewMod({
        images: [],
        videos: [],
        requirements: [],
        features: [],
        tags: []
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

      setMods(mods.filter(m => m.id !== modId));
    } catch (error) {
      console.error('Error deleting mod:', error);
      alert('删除失败，请重试');
    }
  };

  const filteredMods = mods.filter(mod => {
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
        mod.author.name.toLowerCase().includes(searchLower) ||
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
      tags: mod.tags || []
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
        <SortButton field="lastUpdated">更新时间</SortButton>
      </div>

      {/* 显示筛选结果数量 */}
      <div className="text-sm text-gray-600">
        找到 {sortedAndFilteredMods.length} 个Mod
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Mods管理</h2>

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
          <input
            type="text"
            placeholder="Mod名称"
            className="border rounded p-2"
            value={newMod.name || ''}
            onChange={e => setNewMod({...newMod, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Mod描述"
            className="border rounded p-2"
            value={newMod.description || ''}
            onChange={e => setNewMod({...newMod, description: e.target.value})}
          />
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
            placeholder="作者名称"
            className="border rounded p-2"
            value={newMod.author?.name || ''}
            onChange={e => setNewMod({
              ...newMod,
              author: { ...newMod.author, name: e.target.value }
            })}
          />
          <input
            type="text"
            placeholder="下载链接"
            className="border rounded p-2"
            value={newMod.downloadUrl || ''}
            onChange={e => setNewMod({...newMod, downloadUrl: e.target.value})}
          />
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
          >
            添加Mod
          </button>
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
                  value={editingMod.description}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    description: e.target.value
                  })}
                />
                <select
                  className="border rounded p-2"
                  value={editingMod.category}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    category: e.target.value
                  })}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="border rounded p-2"
                  value={editingMod.downloadUrl}
                  onChange={e => setEditingMod({
                    ...editingMod,
                    downloadUrl: e.target.value
                  })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(editingMod)}
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingMod(null)}
                    className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
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
                              alt={image.caption}
                              className="w-full h-32 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleRemoveImage(editingMod, index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <p className="absolute bottom-2 left-2 right-2 text-white text-sm">{image.caption}</p>
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
                          onChange={e => setTempFieldValue({...tempFieldValue, platform: e.target.value})}
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
                    {(editingMod.requirements || []).map((requirement, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <a href={requirement.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                          {requirement.name}
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
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{mod.name}</h3>
                  <p className="text-gray-600">{mod.description}</p>
                  <p className="text-sm text-gray-500">
                    类目: {categories.find(c => c.id === mod.category)?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    作者: <a href={mod.author.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                      {mod.author.name}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    下载量: {mod.downloads} | 评分: {mod.rating}
                  </p>
                </div>

                {/* 图片预览 */}
                {mod.images?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">图片预览</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(mod.images || []).map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image.url} 
                            alt={image.caption} 
                            className="w-full h-32 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm text-center p-2">{image.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 视频链接 */}
                {mod.videos?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">视频演示</h4>
                    <div className="space-y-1">
                      {(mod.videos || []).map((video, index) => (
                        <div key={index}>
                          <a 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            <span className="mr-2">{video.platform === 'youtube' ? '🎬' : '📺'}</span>
                            {video.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 前置要求 */}
                {mod.requirements?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">前置要求</h4>
                    <div className="space-y-1">
                      {(mod.requirements || []).map((req, index) => (
                        <div key={index}>
                          <a 
                            href={req.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600"
                          >
                            {req.name}
                          </a>
                          {req.description && (
                            <p className="text-sm text-gray-500">{req.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModEditor;
