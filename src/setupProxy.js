const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/coingecko', // Defines the prefix for requests to proxy
    createProxyMiddleware({
      target: 'https://api.coingecko.com/api/v3', //target API
      changeOrigin: true,
      pathRewrite: {
        '^/coingecko': '', //this removes the coingecko when forwarding the request
      },
    })
  );
};
