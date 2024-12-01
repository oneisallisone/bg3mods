import { NextApiRequest, NextApiResponse } from 'next';
import { getMod, updateMod, deleteMod } from '../../../lib/modUtils';
import { Mod } from '../../../types/mod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid mod ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const mod = await getMod(id);
        if (!mod) {
          return res.status(404).json({ error: 'Mod not found' });
        }
        return res.status(200).json(mod);

      case 'PUT':
        const updatedMod = await updateMod(req.body as Mod);
        return res.status(200).json(updatedMod);

      case 'DELETE':
        await deleteMod(id);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in mod API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
