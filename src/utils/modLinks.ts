// 定义基础URL
export const NEXUS_BASE_URL = 'https://www.nexusmods.com/baldursgate3/mods';

// 定义mod ID映射
export const MOD_IDS = {
  // 核心依赖和先决条件
  BG3_SCRIPT_EXTENDER: 2172,
  BG3_MOD_MANAGER: 'https://github.com/LaughingLeader/BG3ModManager',
  FULL_RELEASE_MOD_FIXER: 141,
  IMPROVED_UI: 366,
  ACHIEVEMENT_ENABLER: 'https://github.com/gottyduke/BG3_AchievementEnabler',

  // 主要mods
  FIVE_E_SPELLS: 125,
  PARTY_SIZE_BEGONE: 327,
  FANTASTICAL_MULTIVERSE: 215,
  LONE_WOLF: 815,
  TRIALS_OF_TAV: 9907,

  // 依赖mods
  FANTASTICAL_CORE: 215,

  // 外观mods
  TAVS_HAIR_SALON: 213,
  ORIN_HAIR_VARIANT: 1287,
  DYES_UNLIMITED: 936,
  SHIRTS_DRESSES_CORSETS: 5981,
  NEW_CHARACTER_PRESETS: 205,

  // 装备mods
  TRANSMOG: 2922,
  ALL_ITEMS: 856,
  BAGS_BAGS_BAGS: 880,
  GOLD_ZERO_WEIGHT: 616,
  NOBLE_TRICKSTERS_GARMENTS: 734
} as const;

// 定义特殊URL映射
export const SPECIAL_URLS = {
  BG3_MOD_MANAGER: 'https://bg3modmanager.net/download',
  SCRIPT_EXTENDER: 'https://github.com/Norbyte/bg3se/releases',
  IMPROVED_UI: 'https://github.com/TheRealDjmr/BG3ImprovedUI/releases/tag/1.5.0.32',
  ACHIEVEMENT_ENABLER: 'https://github.com/gottyduke/BG3_AchievementEnabler'
} as const;

// 类型定义
type ModId = (typeof MOD_IDS)[keyof typeof MOD_IDS];
type NumericModId = Extract<ModId, number>;

// 生成Nexus链接
export const getNexusModLink = (modId: number): string => {
  return `${NEXUS_BASE_URL}/${modId}`;
};

// 获取mod链接（处理特殊URL和Nexus两种情况）
export const getModLink = (modId: ModId): string => {
  if (typeof modId === 'string') {
    // 检查是否有特殊URL映射
    const specialUrl = Object.entries(SPECIAL_URLS).find(([key]) => 
      modId.toLowerCase().includes(key.toLowerCase())
    );
    if (specialUrl) {
      return specialUrl[1];
    }
    return modId;
  }
  return getNexusModLink(modId);
};

// 验证mod ID是否在已知列表中
export const isValidModId = (modId: number): boolean => {
  const modValues = Object.values(MOD_IDS);
  return modValues.some(value => typeof value === 'number' && value === modId);
};

// 验证URL是否是有效的mod链接
export const isValidModUrl = (url: string): boolean => {
  // 检查特殊URL
  const specialUrls = Object.values(SPECIAL_URLS);
  if (specialUrls.some(specialUrl => specialUrl === url)) return true;
  
  try {
    const urlObj = new URL(url);
    // 检查是否是GitHub链接
    if (urlObj.hostname === 'github.com') {
      return true;
    }
    // 检查是否是Nexus链接
    if (!urlObj.pathname.includes('/mods/')) return false;
    
    const modId = parseInt(urlObj.pathname.split('/').pop() || '');
    return isValidModId(modId);
  } catch {
    return false;
  }
};
