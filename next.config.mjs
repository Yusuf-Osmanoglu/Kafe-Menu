// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      // Google Drive paylaşım görüntüleri
      { protocol: 'https', hostname: 'drive.google.com' },
      // Googleusercontent (thumbnail/cdn)
      { protocol: 'https', hostname: 'lh1.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh2.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh6.googleusercontent.com' },
      // Docs üzerinden gelen görseller (nadir durum)
      { protocol: 'https', hostname: 'docs.google.com' },
    ],
  },
};

export default nextConfig;
