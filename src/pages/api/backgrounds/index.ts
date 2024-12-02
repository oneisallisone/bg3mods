import { NextApiRequest, NextApiResponse } from 'next';
import { Background } from '../../../types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'backgrounds.json');
const BACKGROUNDS_DIR = path.join(process.cwd(), 'public', 'backgrounds');

// 同步数据文件和实际文件
const syncBackgrounds = (): Background[] => {
  try {
    // 读取数据文件
    let backgrounds: Background[] = [];
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      backgrounds = Array.isArray(parsed.backgrounds) ? parsed.backgrounds : [];
    } catch (error) {
      console.error('读取背景图片数据失败:', error);
      backgrounds = [];
    }

    // 读取实际文件
    const files = fs.readdirSync(BACKGROUNDS_DIR);
    const existingFiles = new Set(files);

    // 过滤掉不存在的文件记录
    backgrounds = backgrounds.filter(bg => {
      const fileName = bg.url.split('/').pop();
      return fileName && existingFiles.has(fileName);
    });

    // 保存同步后的数据
    fs.writeFileSync(DATA_FILE, JSON.stringify({ backgrounds }, null, 2));
    return backgrounds;
  } catch (error) {
    console.error('同步背景图片数据失败:', error);
    return [];
  }
};

const loadBackgrounds = (): Background[] => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // 确保没有重复的 ID
    const uniqueBackgrounds = Array.isArray(parsed.backgrounds) 
      ? parsed.backgrounds.filter((bg: Background, index: number, self: Background[]) => 
          index === self.findIndex((t) => t.id === bg.id)
        )
      : [];
    
    // 如果发现重复，保存去重后的数据
    if (uniqueBackgrounds.length !== parsed.backgrounds?.length) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ backgrounds: uniqueBackgrounds }, null, 2));
    }
    
    return uniqueBackgrounds;
  } catch (error) {
    console.error('加载背景图片数据失败:', error);
    return [];
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 确保用户已登录
  const isAdmin = req.cookies.adminToken === process.env.ADMIN_TOKEN;
  if (!isAdmin) {
    return res.status(401).json({ error: '未授权' });
  }

  // 只处理 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    // 同步并加载背景图片数据
    const backgrounds = syncBackgrounds();
    return res.status(200).json(backgrounds);
  } catch (error) {
    console.error('处理请求失败:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
}
