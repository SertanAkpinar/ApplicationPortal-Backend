var mongoose = require('mongoose');
const config = require('config');

let _db;
const connectionString = config.get('db.connectionString');

function initDB(callback){
        mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        _db = mongoose.connection;

        _db.on('error', console.error.bind(console, 'connection error: '));
        _db.once('open', function() {
            callback(null, _db);
        });
    }

function close(){
    return _db;
}

module.exports = {
    close, 
    initDB
}