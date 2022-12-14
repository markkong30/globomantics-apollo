const { RESTDataSource } = require('@apollo/datasource-rest');

const lodashId = require('lodash-id');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./data/users.json');
const db = low(adapter);
db._.mixin(lodashId);

class UserDataSource {
	initialize(config) {
		this.db = db.get('users');
	}

	getUsers(args) {
		this.initialize();

		return this.db.value();
	}

	getUserById(id) {
		this.initialize();

		return this.db.getById(id).value();
	}

	createUser(user) {
		this.initialize();

		return this.db.insert(user).write();
	}

	getUserByEmail(email) {
		this.initialize();

		return this.db.find({ email }).value();
	}

	toggleFavoriteSession(sessionId, userId) {
		this.initialize();

		const favorites = this.db.getById(userId).get('favorites').value() || [];

		let set = [];
		if (favorites.includes(sessionId)) {
			// remove it
			set = [...favorites.filter((fav) => fav !== sessionId)];
		} else {
			// add it
			set = [...favorites, sessionId];
		}

		return this.db.getById(userId).assign({ favorites: set }).write();
	}
}

module.exports = UserDataSource;
