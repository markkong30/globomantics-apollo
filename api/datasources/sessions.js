const { RESTDataSource } = require('@apollo/datasource-rest');
const lodashId = require('lodash-id');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./data/sessions.json');
const db = low(adapter);
db._.mixin(lodashId);

class SessionDataSource {
	initialize(config) {
		this.db = db.get('sessions');
	}

	getSessions(args) {
		this.initialize();

		return this.db.filter(args).value();
	}

	getSessionById(id) {
		this.initialize();

		return this.db.getById(id).value();
	}

	createSession(session) {
		this.initialize();

		return this.db.insert(session).write();
	}
}

module.exports = SessionDataSource;
