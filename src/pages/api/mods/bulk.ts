import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { validateModFile } from '../../../lib/modValidator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { mods } = req.body;

    // 验证导入数据
    const validationResult = validateModFile(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors: validationResult.errors
      });
    }

    const db = await getDb();
    await db.run('BEGIN TRANSACTION');

    try {
      for (const mod of mods) {
        // 插入主要mod信息
        await db.run(`
          INSERT INTO mods (
            id, name, description, category,
            author_name, author_url, downloads,
            rating, version, last_updated, download_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          mod.id,
          mod.name,
          mod.description,
          mod.category,
          mod.author_name,
          mod.author_url,
          mod.downloads || 0,
          mod.rating || 0,
          mod.version,
          mod.last_updated,
          mod.download_url
        ]);

        // 插入图片
        if (mod.images && mod.images.length > 0) {
          const imageStmt = await db.prepare(
            'INSERT INTO mod_images (mod_id, url, caption) VALUES (?, ?, ?)'
          );
          for (const image of mod.images) {
            await imageStmt.run([mod.id, image.url, image.caption]);
          }
          await imageStmt.finalize();
        }

        // 插入视频
        if (mod.videos && mod.videos.length > 0) {
          const videoStmt = await db.prepare(
            'INSERT INTO mod_videos (mod_id, url, title, platform) VALUES (?, ?, ?, ?)'
          );
          for (const video of mod.videos) {
            await videoStmt.run([mod.id, video.url, video.title, video.platform]);
          }
          await videoStmt.finalize();
        }

        // 插入前置要求
        if (mod.requirements && mod.requirements.length > 0) {
          const reqStmt = await db.prepare(
            'INSERT INTO mod_requirements (mod_id, name, url, description) VALUES (?, ?, ?, ?)'
          );
          for (const req of mod.requirements) {
            await reqStmt.run([mod.id, req.name, req.url, req.description]);
          }
          await reqStmt.finalize();
        }

        // 插入特性
        if (mod.features && mod.features.length > 0) {
          const featureStmt = await db.prepare(
            'INSERT INTO mod_features (mod_id, feature) VALUES (?, ?)'
          );
          for (const feature of mod.features) {
            await featureStmt.run([mod.id, feature]);
          }
          await featureStmt.finalize();
        }

        // 插入标签
        if (mod.tags && mod.tags.length > 0) {
          const tagStmt = await db.prepare(
            'INSERT INTO mod_tags (mod_id, tag) VALUES (?, ?)'
          );
          for (const tag of mod.tags) {
            await tagStmt.run([mod.id, tag]);
          }
          await tagStmt.finalize();
        }
      }

      await db.run('COMMIT');

      return res.status(200).json({
        success: true,
        message: `成功导入 ${mods.length} 个mod`,
        imported_count: mods.length
      });

    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('批量导入错误:', error);
    return res.status(500).json({
      success: false,
      message: '导入失败',
      error: error.message
    });
  }
}
