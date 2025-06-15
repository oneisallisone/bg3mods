import { NextApiRequest, NextApiResponse } from 'next';
import exportedData from '../../../data/exported-data.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting JSON-based data restore...');
    console.log('Data timestamp:', exportedData.timestamp);
    console.log('Data counts:', exportedData.counts);

    // 简单返回数据统计，确认数据可用
    const response = {
      success: true,
      message: 'JSON data restore ready',
      timestamp: exportedData.timestamp,
      originalCounts: exportedData.counts,
      status: 'Using JSON file storage until PostgreSQL is ready',
      nextSteps: [
        '1. Data is available in JSON format',
        '2. Once PostgreSQL environment variables are active, use import-original-data API',
        '3. Check Vercel dashboard for PostgreSQL status'
      ]
    };

    console.log('JSON restore response:', response);
    return res.status(200).json(response);

  } catch (error) {
    console.error('JSON restore error:', error);
    return res.status(500).json({
      success: false,
      error: 'JSON restore failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 