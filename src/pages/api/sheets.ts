import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  // Anahtar dosyasının yolunu belirle
  const credentialsPath = path.join(process.cwd(), 'credentials.json');

  if (!fs.existsSync(credentialsPath) || !spreadsheetId) {
    console.error('Missing credentials.json file or GOOGLE_SHEET_ID in .env.local');
    return res.status(500).json({ error: 'Missing credentials.json file or GOOGLE_SHEET_ID' });
  }

  try {
    // credentials.json dosyasını oku
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Google API'leri için kimlik doğrulama
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      // Daha geniş aralık: Görsel sütunu E'den ileride olabilir
      range: 'Sayfa1!A:Z',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(200).json({ data: [] });
    }

    // Kaynak sütun adlarını beklenen anahtarlara eşle
    const keyMap: Record<string, string> = {
      'Title': 'title',
      'Başlık': 'title',
      'Ana Başlık': 'title',
      'Category': 'category',
      'Kategori': 'category',
      'Alt Kategori': 'category',
      'Name': 'name',
      'İsim': 'name',
      'Ad': 'name',
      'Description': 'description',
      'Açıklama': 'description',
      'Image': 'imageUrl',
      'Image URL': 'imageUrl',
      'Resim': 'imageUrl',
      'Görsel': 'imageUrl',
      'Görsel Linki': 'imageUrl',
      'Resim Linki': 'imageUrl',
      'Foto': 'imageUrl',
      'Fotoğraf': 'imageUrl',
      'Link': 'imageUrl',
      'Price': 'price',
      'Fiyat': 'price',
      'Old Price': 'oldPrice',
      'Eski Fiyat': 'oldPrice',
    };

    const headers = rows[0].map((h) => (h ?? '').toString().trim());

    // Google Drive görsel bağlantılarını görüntülenebilir forma çevir
    const normalizeImageUrl = (url?: string): string => {
      if (!url) return '';
      try {
        // Eğer zaten googleusercontent ya da bilinen bir http(s) ise olduğu gibi (Next config izinli)
        if (/^https?:\/\//i.test(url)) {
          // drive.google.com/file/d/{ID}/view?usp=sharing -> uc?export=view&id={ID}
          if (url.includes('drive.google.com')) {
            // 1) /file/d/{id}/
            const m = url.match(/\/file\/d\/([^/]+)\//);
            if (m && m[1]) {
              return `https://drive.google.com/uc?export=view&id=${m[1]}`;
            }
            // 2) ?id={id}
            const urlObj = new URL(url);
            const idParam = urlObj.searchParams.get('id');
            if (idParam) {
              return `https://drive.google.com/uc?export=view&id=${idParam}`;
            }
          }
          return url;
        }
        return '';
      } catch {
        return '';
      }
    };

    const data = rows.slice(1).map((row) => {
      const raw: Record<string, string> = {};
      row.forEach((cell, index) => {
        const srcKey = (headers[index] ?? '').toString().trim();
        const dstKey = keyMap[srcKey] || srcKey; // eşleşme yoksa orijinali koy
        const value = (cell ?? '').toString().trim();
        raw[dstKey] = value;
      });

      // imageUrl normalizasyonu
      if (raw.imageUrl) {
        raw.imageUrl = normalizeImageUrl(raw.imageUrl);
      }

      // Beklenen alanlar yoksa boş string ver
      raw.title = raw.title ?? '';
      raw.category = raw.category ?? '';
      raw.name = raw.name ?? '';
      raw.description = raw.description ?? '';
      raw.price = raw.price ?? '';

      return raw;
    });

    return res.status(200).json({ data });
  } catch (error) {
    console.error('API Error:', error);
    // Hata detayını istemciye göndermek için error objesini güvenli şekilde işle
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
    return res.status(500).json({ error: errorMessage });
  }
}