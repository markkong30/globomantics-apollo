const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		'/graphql',
		createProxyMiddleware({
			target: 'https://globomantics-apollo-production-dc23.up.railway.app',
			changeOrigin: true
		})
	);
};
