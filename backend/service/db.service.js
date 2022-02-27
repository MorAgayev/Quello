const MongoClient = require('mongodb').MongoClient;
const logger = require('./logger.service');

const config = require('../config');

module.exports = {
    getCollection
}

// Database Name
const dbName = 'qwello';

var dbConn = null;

async function getCollection(collectionName) {
    try {
        const db = dbConn || await connect();
        const collection = await db.collection(collectionName);
        return collection;
    } catch (err) {
        logger.error(
            "MongoDB",
            "Connection failed",
            `Can't' get '${collectionName}' from '${dbName}'`,
            err
        );
        throw err;
    }
}

async function connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        dbConn = db;
        logger.info("MongoDB", "Connected", dbName);
        return db;
    } catch (err) {
        logger.error("MongoDB", `Can't Connect to '${dbName}'`, err);
        throw err;
    }
}




