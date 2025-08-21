import type { NextApiRequest, NextApiResponse } from 'next';

// Simple server-side proxy for fetching remote images (e.g., Google Drive)
// Usage: /api/proxy-image?url=<encoded_image_url>
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      res.status(400).send('Missing url');
      return;
    }

    // Basic validation: only allow http(s)
    if (!/^https?:\/\//i.test(url)) {
      res.status(400).send('Invalid url');
      return;
    }

    // Fetch the remote image
    const upstream = await fetch(url, {
      // Avoid sending cookies/credentials to third-parties
      redirect: 'follow',
    });

    if (!upstream.ok) {
      res.status(upstream.status).send('Upstream error');
      return;
    }

    // Forward content-type and caching headers
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    // Cache for 1 day, allow CDN/proxy caching
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');

    // Stream the body to the client
    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('proxy-image error', error);
    res.status(500).send('Proxy failed');
  }
}
