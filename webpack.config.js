module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://atlascopcoserver-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
};