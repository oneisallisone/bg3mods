import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filename: (name, ext, part, form) => {
        // 生成唯一文件名
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
      },
    });

    type ParseResult = {
      fields: formidable.Fields;
      files: formidable.Files;
    };

    const { fields, files } = await new Promise<ParseResult>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Parse error:', err);
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    // 获取上传的文件
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 生成相对路径URL
    const relativePath = path.relative(
      path.join(process.cwd(), 'public'),
      uploadedFile.filepath
    );
    const fileUrl = `/${relativePath.replace(/\\/g, '/')}`;

    return res.status(200).json({ 
      url: fileUrl,
      filename: uploadedFile.originalFilename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
