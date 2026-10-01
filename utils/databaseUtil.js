const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const MONGO_URL = "mongodb+srv://anupchaudhary048_db_user:anupmongodb10@airbnb-cluster.jvicaif.mongodb.net/?appName=airbnb-cluster"

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(MONGO_URL)
    .then(client => {
        callback();
        _db = client.db('airbnb');
    }).catch(err => {
        console.log("Error while connecting to Mongo: ", err);
    });
}

const getDB = () => {
    if(!_db){
        throw new Error('Mongo not connected');
    }
    return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

