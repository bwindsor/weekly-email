import * as mysql from 'mysql'
import {Credentials} from './types.d'
import * as fs from 'fs'

export const TABLE_NAME = "trainings";
export var connection : mysql.IConnection;

let content = fs.readFileSync('./credentials.json');
let credentials: Credentials = JSON.parse(content.toString());

connection = mysql.createConnection({
    host     : credentials.mysql.host,
    user     : credentials.mysql.user,
    password : credentials.mysql.password,
    database : credentials.mysql.db_name
});

connection.connect(function(err) {
    if (err) throw err;
});