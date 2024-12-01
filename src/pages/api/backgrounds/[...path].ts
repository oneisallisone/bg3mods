import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import sharp from 'sharp';

// 配置body解析
export const config = {
  api: {
    // 完全禁用默认的body解析器
    bodyParser: false,
  },
};

const BACKGROUNDS_DIR = path.join(process.cwd(), 'public', 'backgrounds');
const DATA_FILE = path.join(process.cwd(), 'data', 'backgrounds.json');

// 确保目录存在
if (!fs.existsSync(BACKGROUNDS_DIR)) {
  fs.mkdirSync(BACKGROUNDS_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// 如果数据文件不存在，创建一个空的数据文件
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ backgrounds: [] }));
}

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

// 手动解析JSON body
const parseJsonBody = async (req: NextApiRequest) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const data = Buffer.concat(chunks).toString();
  return JSON.parse(data);
};

const loadBackgrounds = (): Background[] => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed.backgrounds) ? parsed.backgrounds : [];
  } catch (error) {
    console.error('加载背景图片数据失败:', error);
    return [];
  }
};

const saveBackgrounds = (backgrounds: Background[]) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ backgrounds }, null, 2));
};

// 验证URL是否为图片
const validateImageUrl = async (url: string): Promise<{ valid: boolean; metadata?: sharp.Metadata }> => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.startsWith('image/')) {
      return { valid: false };
    }

    // 使用sharp验证图片并获取元数据
    const metadata = await sharp(Buffer.from(buffer)).metadata();
    return { valid: true, metadata };
  } catch {
    return { valid: false };
  }
};

// 下载并转换远程图片为WebP
const downloadAndConvertToWebP = async (url: string, outputPath: string): Promise<sharp.Metadata> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const image = sharp(Buffer.from(buffer));
  const metadata = await image.metadata();
  
  // 转换为WebP格式并保存
  await image
    .webp({
      quality: 80,
      effort: 6,
    })
    .toFile(outputPath);

  return metadata;
};

// 转换上传的图片为WebP
const convertToWebP = async (inputPath: string, outputPath: string): Promise<sharp.Metadata> => {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // 转换为WebP格式并保存
  await image
    .webp({
      quality: 80,
      effort: 6,
    })
    .toFile(outputPath);

  return metadata;
};

// 安全地删除文件
const safeUnlink = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error(`删除文件失败: ${filePath}`, error);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 确保用户已登录
  const isAdmin = req.cookies.adminToken === process.env.ADMIN_TOKEN;
  if (!isAdmin) {
    return res.status(401).json({ error: '未授权' });
  }

  const { path: pathSegments } = req.query;
  const segments = Array.isArray(pathSegments) ? pathSegments : [pathSegments];

  if (!segments || segments.length === 0) {
    return res.status(400).json({ error: '无效的请求路径' });
  }

  try {
    // POST /api/backgrounds/add-url
    if (req.method === 'POST' && segments[0] === 'add-url') {
      const body = await parseJsonBody(req);
      const { url } = body;
      
      if (!url) {
        return res.status(400).json({ error: '缺少URL参数' });
      }

      const validation = await validateImageUrl(url);
      if (!validation.valid) {
        return res.status(400).json({ error: '无效的图片URL' });
      }

      const id = uuidv4();
      const webpFileName = `${id}.webp`;
      const webpPath = path.join(BACKGROUNDS_DIR, webpFileName);

      try {
        // 下载并转换图片
        const metadata = await downloadAndConvertToWebP(url, webpPath);
        
        const backgrounds = loadBackgrounds();
        const newBackground = {
          id,
          url: `/backgrounds/${webpFileName}`,
          active: backgrounds.length === 0,
          isLocal: true, // 现在我们总是存储为本地文件
          originalFormat: validation.metadata?.format,
          width: metadata.width,
          height: metadata.height,
          size: fs.statSync(webpPath).size,
        };

        backgrounds.push(newBackground);
        saveBackgrounds(backgrounds);

        return res.status(200).json(newBackground);
      } catch (error) {
        // 如果转换失败，清理临时文件
        await safeUnlink(webpPath);
        console.error('图片处理失败:', error);
        return res.status(500).json({ error: '图片处理失败' });
      }
    }

    // POST /api/backgrounds/upload
    if (req.method === 'POST' && segments[0] === 'upload') {
      // 对于文件上传，我们需要手动解析multipart/form-data
      const form = formidable({
        uploadDir: BACKGROUNDS_DIR,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });

      try {
        const [fields, files] = await form.parse(req);
        const file = files.file?.[0];
        
        if (!file) {
          return res.status(400).json({ error: '没有上传文件' });
        }

        const id = uuidv4();
        const originalFormat = path.extname(file.originalFilename || '').slice(1);
        const webpFileName = `${id}.webp`;
        const webpPath = path.join(BACKGROUNDS_DIR, webpFileName);

        try {
          // 转换为WebP格式
          const metadata = await convertToWebP(file.filepath, webpPath);

          // 删除原始文件
          await safeUnlink(file.filepath);

          const backgrounds = loadBackgrounds();
          const newBackground = {
            id,
            url: `/backgrounds/${webpFileName}`,
            active: backgrounds.length === 0,
            isLocal: true,
            originalFormat,
            width: metadata.width,
            height: metadata.height,
            size: fs.statSync(webpPath).size,
          };

          backgrounds.push(newBackground);
          saveBackgrounds(backgrounds);

          return res.status(200).json(newBackground);
        } catch (error) {
          // 如果转换失败，清理所有临时文件
          await safeUnlink(file.filepath);
          await safeUnlink(webpPath);
          console.error('图片处理失败:', error);
          return res.status(500).json({ error: '图片处理失败' });
        }
      } catch (error) {
        console.error('文件上传失败:', error);
        return res.status(500).json({ error: '文件上传失败' });
      }
    }

    // POST /api/backgrounds/:id/toggle
    if (req.method === 'POST' && segments[1] === 'toggle') {
      const id = segments[0];
      const backgrounds = loadBackgrounds();
      const background = backgrounds.find(bg => bg.id === id);

      if (!background) {
        return res.status(404).json({ error: '背景图片不存在' });
      }

      const updatedBackgrounds = backgrounds.map(bg => ({
        ...bg,
        active: bg.id === id ? !bg.active : false,
      }));

      saveBackgrounds(updatedBackgrounds);
      return res.status(200).json({ success: true });
    }

    // DELETE /api/backgrounds/:id
    if (req.method === 'DELETE' && segments.length === 1) {
      const id = segments[0];
      const backgrounds = loadBackgrounds();
      const background = backgrounds.find(bg => bg.id === id);

      if (!background) {
        return res.status(404).json({ error: '背景图片不存在' });
      }

      // 删除文件
      const fileName = background.url.split('/').pop();
      if (fileName) {
        const filePath = path.join(BACKGROUNDS_DIR, fileName);
        await safeUnlink(filePath);
      }

      // 更新数据
      const updatedBackgrounds = backgrounds.filter(bg => bg.id !== id);
      saveBackgrounds(updatedBackgrounds);

      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: '接口不存在' });
  } catch (error) {
    console.error('API错误:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : '服务器错误' });
  }
}
