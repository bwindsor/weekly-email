import * as mysql from 'mysql'
import * as fs from 'fs'
import credentials from './credentials'

export const TABLE_NAME = "trainings";
export var connection : mysql.IConnection;

connection = mysql.createConnection({
    host     : credentials.mysql.host,
    user     : credentials.mysql.user,
    password : credentials.mysql.password,
    database : credentials.mysql.db_name
});

connection.connect(function(err) {
    if (err) throw err;
});