const { RESTDataSource } = require('@apollo/datasource-rest');

const lodashId = require('lodash-id');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { groupBy } = require('lodash');

const adapter = new FileSync('./data/speakers.json');
const db = low(adapter);
db._.mixin(lodashId);

class SpeakerDataSource {
	constructor(initializeDB) {
		this.initializeDB = initializeDB;
	}

	initialize(config) {
		this.db = db;
	}

	async getSpeakerById(id) {
		this.initialize();

		this.db.get('speakers').getById(id).value();
	}

	async getSpeakers(args) {
		this.initialize();

		const data = this.db.get('speakers').filter(args).value();
		return data;
	}

	async markFeatured(speakerId, featured) {
		this.initialize();

		const data = this.db
			.get('speakers')
			.find({ id: speakerId })
			.assign({ featured })
			.write();
		return data;
	}
}

module.exports = SpeakerDataSource;
