import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { Mod } from '../../../types/mod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  try {
    switch (req.method) {
      case 'GET':
        const mods = await db.all(`
          SELECT 
            m.*,
            COALESCE(
              json_group_array(
                CASE WHEN mi.url IS NOT NULL 
                  THEN json_object('url', mi.url, 'caption', mi.caption)
                  ELSE NULL 
                END
              ), '[]'
            ) as images,
            COALESCE(
              json_group_array(
                CASE WHEN mv.url IS NOT NULL 
                  THEN json_object('url', mv.url, 'title', mv.title, 'platform', mv.platform)
                  ELSE NULL 
                END
              ), '[]'
            ) as videos,
            COALESCE(
              json_group_array(
                CASE WHEN mr.name IS NOT NULL 
                  THEN json_object('name', mr.name, 'url', mr.url, 'description', mr.description)
                  ELSE NULL 
                END
              ), '[]'
            ) as requirements,
            COALESCE(
              json_group_array(
                CASE WHEN mf.feature IS NOT NULL 
                  THEN mf.feature 
                  ELSE NULL 
                END
              ), '[]'
            ) as features,
            COALESCE(
              json_group_array(
                CASE WHEN mt.tag IS NOT NULL 
                  THEN mt.tag 
                  ELSE NULL 
                END
              ), '[]'
            ) as tags
          FROM mods m
          LEFT JOIN mod_images mi ON m.id = mi.mod_id
          LEFT JOIN mod_videos mv ON m.id = mv.mod_id
          LEFT JOIN mod_requirements mr ON m.id = mr.mod_id
          LEFT JOIN mod_features mf ON m.id = mf.mod_id
          LEFT JOIN mod_tags mt ON m.id = mt.mod_id
          GROUP BY m.id
        `);

        // 处理JSON字符串并移除NULL值
        const processedMods = mods.map(mod => ({
          ...mod,
          author: {
            name: mod.author_name,
            url: mod.author_url
          },
          images: JSON.parse(mod.images).filter(Boolean),
          videos: JSON.parse(mod.videos).filter(Boolean),
          requirements: JSON.parse(mod.requirements).filter(Boolean),
          features: JSON.parse(mod.features).filter(Boolean),
          tags: JSON.parse(mod.tags).filter(Boolean)
        }));

        return res.status(200).json(processedMods);

      case 'POST':
        const mod = req.body as Mod;
        
        // 开始事务
        await db.run('BEGIN TRANSACTION');

        try {
          // 插入mod基本信息
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
            mod.author.name,
            mod.author.url,
            mod.downloads,
            mod.rating,
            mod.version,
            mod.lastUpdated,
            mod.downloadUrl
          ]);

          // 插入图片
          for (const image of mod.images) {
            await db.run(
              'INSERT INTO mod_images (mod_id, url, caption) VALUES (?, ?, ?)',
              [mod.id, image.url, image.caption]
            );
          }

          // 插入视频
          for (const video of mod.videos) {
            await db.run(
              'INSERT INTO mod_videos (mod_id, url, title, platform) VALUES (?, ?, ?, ?)',
              [mod.id, video.url, video.title, video.platform]
            );
          }

          // 插入要求
          for (const req of mod.requirements) {
            await db.run(
              'INSERT INTO mod_requirements (mod_id, name, url, description) VALUES (?, ?, ?, ?)',
              [mod.id, req.name, req.url, req.description]
            );
          }

          // 插入特性
          for (const feature of mod.features) {
            await db.run(
              'INSERT INTO mod_features (mod_id, feature) VALUES (?, ?)',
              [mod.id, feature]
            );
          }

          // 插入标签
          for (const tag of mod.tags) {
            await db.run(
              'INSERT INTO mod_tags (mod_id, tag) VALUES (?, ?)',
              [mod.id, tag]
            );
          }

          // 提交事务
          await db.run('COMMIT');
          return res.status(201).json(mod);
        } catch (error) {
          // 回滚事务
          await db.run('ROLLBACK');
          throw error;
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
