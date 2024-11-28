/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
  },
}

module.exports = nextConfig
