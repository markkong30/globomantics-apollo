require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const SessionDataSource = require('./datasources/sessions');
const SpeakerDataSource = require('./datasources/speakers');
const UserDataSource = require('./datasources/users');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers/index');
const auth = require('./utils/auth');
const cors = require('cors');
const http = require('http');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const dataSources = () => ({
	sessionDataSource: new SessionDataSource(),
	speakerDataSource: new SpeakerDataSource(),
	userDataSource: new UserDataSource()
});

// app.use(cookieParser());

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   dataSources
// });

// server.applyMiddleware({ app });

// app.listen(process.env.PORT || 4000, () => {
//   console.log(`graphQL running at port 4000`);
// });

// const httpServer = http.createServer(app);
const server = new ApolloServer({
	typeDefs,
	resolvers
});

async function startApolloServer(typeDefs, resolvers) {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [cookieParser()]
	});

	const { url } = await startStandaloneServer(server, {
		context: async ({ req }) => {
			const { cache } = server;
			const token = req.headers.token;
			const cookie = req.headers.cookie;
			return {
				token,
				cookie,
				dataSources: {
					sessionDataSource: new SessionDataSource({ cache, token, cookie }),
					speakerDataSource: new SpeakerDataSource({ cache, token, cookie }),
					userDataSource: new UserDataSource({ cache, token, cookie })
				}
			};
		}
	});

	console.log(`🚀  Server is running at ${url}`);
}

startApolloServer(typeDefs, resolvers);
