// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        //pathname: '/**', // Bu opsiyoneldir, ama daha spesifik olmanıza yardımcı olur.
      },
      // Eğer Google Drive'dan direkt resim alıyorsanız
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      // Veya Google'ın sunucu adresi
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;