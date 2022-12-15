const { createProxyMiddleware } = require('http-proxy-middleware');
const target =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:4000'
		: 'https://globomantics-apollo-production-dc23.up.railway.app';

module.exports = function (app) {
	app.use(
		'/graphql',
		createProxyMiddleware({
			target,
			changeOrigin: true
		})
	);
};
