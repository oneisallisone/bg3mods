import { MOD_IDS, isValidModUrl, getModLink } from './modLinks';

interface Requirement {
  name: string;
  url: string;
  description: string;
}

interface Mod {
  id: string;
  name: string;
  download_url: string;
  requirements: Requirement[];
  [key: string]: any; // 其他字段
}

interface ModTemplate {
  schema_version: string;
  mods: Mod[];
}

export class ModTemplateValidator {
  private template: ModTemplate;

  constructor(template: ModTemplate) {
    this.template = template;
  }

  // 验证并修复所有链接
  public validateAndFixLinks(): ModTemplate {
    const fixedTemplate = { ...this.template };
    
    fixedTemplate.mods = this.template.mods.map(mod => {
      // 修复主下载链接
      const fixedMod = { ...mod };
      if (!isValidModUrl(mod.download_url)) {
        console.warn(`Invalid download URL found for mod ${mod.name}: ${mod.download_url}`);
        // 尝试根据mod ID查找正确的链接
        const modIdMatch = mod.download_url.match(/\/mods\/(\d+)/);
        if (modIdMatch) {
          const correctId = Object.values(MOD_IDS).find(id => 
            typeof id === 'number' && id.toString() === modIdMatch[1]
          );
          if (correctId && typeof correctId === 'number') {
            fixedMod.download_url = getModLink(correctId);
          }
        }
      }

      // 修复依赖链接
      if (fixedMod.requirements) {
        fixedMod.requirements = fixedMod.requirements.map(req => {
          const fixedReq = { ...req };
          if (!isValidModUrl(req.url)) {
            console.warn(`Invalid requirement URL found for ${req.name}: ${req.url}`);
            // 尝试从已知mod列表中找到匹配项
            const correctId = Object.values(MOD_IDS).find(id => 
              typeof id === 'number' && req.url.includes(`/mods/${id}`)
            );
            if (correctId && typeof correctId === 'number') {
              fixedReq.url = getModLink(correctId);
            }
          }
          return fixedReq;
        });
      }

      return fixedMod;
    });

    return fixedTemplate;
  }

  // 获取所有无效链接的报告
  public getInvalidLinksReport(): string[] {
    const issues: string[] = [];

    this.template.mods.forEach(mod => {
      if (!isValidModUrl(mod.download_url)) {
        issues.push(`Invalid download URL for ${mod.name}: ${mod.download_url}`);
      }

      mod.requirements?.forEach(req => {
        if (!isValidModUrl(req.url)) {
          issues.push(`Invalid requirement URL for ${mod.name} -> ${req.name}: ${req.url}`);
        }
      });
    });

    return issues;
  }

  // 验证模板中的所有链接
  public validateAllLinks(): boolean {
    return this.getInvalidLinksReport().length === 0;
  }
}

// 工具函数：从文件加载并验证模板
export async function validateModTemplateFile(templatePath: string): Promise<string[]> {
  try {
    const template = require(templatePath);
    const validator = new ModTemplateValidator(template);
    return validator.getInvalidLinksReport();
  } catch (error: any) {
    return [`Error loading template file: ${error?.message || 'Unknown error'}`];
  }
}

// 工具函数：修复模板文件中的链接
export async function fixModTemplateLinks(templatePath: string): Promise<ModTemplate> {
  const template = require(templatePath);
  const validator = new ModTemplateValidator(template);
  return validator.validateAndFixLinks();
}
