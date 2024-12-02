import { NextApiRequest, NextApiResponse } from 'next';
import { createMod, updateMod, deleteMod, listMods } from '../../../lib/modUtils';
import { Mod } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        const { category } = req.query;
        const mods = await listMods(category as string);
        return res.status(200).json(mods);

      case 'POST':
        const newMod = await createMod(req.body as Mod);
        return res.status(201).json(newMod);

      case 'PUT':
        const updatedMod = await updateMod(req.body as Mod);
        return res.status(200).json(updatedMod);

      case 'DELETE':
        const { id } = req.query;
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid mod ID' });
        }
        await deleteMod(id);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in mods API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
