import { Mod } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 验证单个Mod数据
export function validateMod(mod: any): ValidationResult {
  const errors: string[] = [];

  // 检查必填字段
  const requiredFields = [
    'id',
    'name',
    'description',
    'category',
    'author_name',
    'version',
    'download_url'
  ];

  for (const field of requiredFields) {
    if (!mod[field]) {
      errors.push(`缺少必填字段: ${field}`);
    }
  }

  // 验证ID格式
  if (mod.id && !/^[a-zA-Z0-9-]+$/.test(mod.id)) {
    errors.push('ID只能包含字母、数字和横线');
  }

  // 验证分类
  const validCategories = [
    'prerequisites',
    'ui',
    'gameplay',
    'appearance',
    'equipment',
    'dice',
    'balance',
    'class',
    'modifiers',
    'tools'
  ];
  
  if (mod.category && !validCategories.includes(mod.category)) {
    errors.push(`无效的分类: ${mod.category}。有效分类: ${validCategories.join(', ')}`);
  }

  // 验证评分范围
  if (mod.rating !== undefined && (mod.rating < 0 || mod.rating > 5)) {
    errors.push('评分必须在0-5之间');
  }

  // 验证日期格式
  if (mod.last_updated && !/^\d{4}-\d{2}-\d{2}$/.test(mod.last_updated)) {
    errors.push('last_updated必须是YYYY-MM-DD格式');
  }

  // 验证数组字段的结构
  if (mod.images) {
    if (!Array.isArray(mod.images)) {
      errors.push('images必须是数组');
    } else {
      mod.images.forEach((image: any, index: number) => {
        if (!image.url) {
          errors.push(`图片${index + 1}缺少url`);
        }
      });
    }
  }

  if (mod.videos) {
    if (!Array.isArray(mod.videos)) {
      errors.push('videos必须是数组');
    } else {
      mod.videos.forEach((video: any, index: number) => {
        if (!video.url) {
          errors.push(`视频${index + 1}缺少url`);
        }
        if (video.platform && !['youtube', 'bilibili'].includes(video.platform)) {
          errors.push(`视频${index + 1}的platform必须是youtube或bilibili`);
        }
      });
    }
  }

  if (mod.requirements) {
    if (!Array.isArray(mod.requirements)) {
      errors.push('requirements必须是数组');
    } else {
      mod.requirements.forEach((req: any, index: number) => {
        if (!req.name) {
          errors.push(`前置要求${index + 1}缺少name`);
        }
      });
    }
  }

  if (mod.features && !Array.isArray(mod.features)) {
    errors.push('features必须是数组');
  }

  if (mod.tags && !Array.isArray(mod.tags)) {
    errors.push('tags必须是数组');
  }

  // 设置默认值
  const defaultValues = {
    downloads: 0,
    rating: 0,
    images: [],
    videos: [],
    requirements: [],
    features: [],
    tags: []
  };

  // 返回验证结果
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证整个导入文件
export function validateModFile(data: any): ValidationResult {
  const errors: string[] = [];

  // 检查基本结构
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['无效的JSON格式']
    };
  }

  // 检查mods数组
  if (!Array.isArray(data.mods)) {
    return {
      isValid: false,
      errors: ['文件必须包含mods数组']
    };
  }

  // 检查schema版本
  if (data.schema_version !== '1.2.0') {
    errors.push('不支持的schema版本，当前仅支持1.2.0');
  }

  // 验证每个mod
  data.mods.forEach((mod: any, index: number) => {
    const result = validateMod(mod);
    if (!result.isValid) {
      errors.push(`Mod #${index + 1} 验证失败：`);
      result.errors.forEach(error => {
        errors.push(`  - ${error}`);
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
