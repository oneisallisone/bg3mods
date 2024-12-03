import { NextApiRequest, NextApiResponse } from 'next';
import { createMod, listMods, checkModExists } from '../../../lib/modUtils';
import { Mod } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        const { category } = req.query;
        const mods = await listMods(category as string);
        res.status(200).json(mods);
        break;

      case 'POST':
        const modData = req.body as Mod;
        
        // 验证必要字段
        if (!modData.name || !modData.description || !modData.category) {
          res.status(400).json({
            error: 'Bad Request',
            details: 'Missing required fields'
          });
          break;
        }

        // 生成或验证 ID
        if (!modData.id) {
          do {
            modData.id = uuidv4();
          } while (await checkModExists(modData.id));
        } else if (await checkModExists(modData.id)) {
          res.status(409).json({
            error: 'Conflict',
            details: 'Mod ID already exists'
          });
          break;
        }

        try {
          const newMod = await createMod(modData);
          res.status(201).json(newMod);
        } catch (error) {
          if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT')) {
            res.status(409).json({
              error: 'Conflict',
              details: 'Mod ID already exists'
            });
          } else {
            throw error;
          }
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        break;
    }
  } catch (error) {
    console.error('Error in mods API:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
