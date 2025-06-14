/** @type {import('next').NextConfig} */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV !== 'production'
    
    if (!isDev) {
      // No special rewrites needed in production
      return {
        beforeFiles: [],
      }
    }
    
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-use-https',
              value: 'true',
            },
          ],
          destination: 'https://localhost:3001/:path*',
        },
      ],
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[name].[contenthash].css',
        })
      );
    }
    return config;
  },
}

module.exports = nextConfig 