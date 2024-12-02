/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map((ext) => `page.${ext}`),
  webpack: (config, { dev, isServer }) => {
    // 排除 backup 目录
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backup/**']
    };
    return config;
  }
}

module.exports = nextConfig
