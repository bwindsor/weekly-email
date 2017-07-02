import * as mysql from 'mysql'
import {Credentials} from './types.d'
import * as fs from 'fs'

export function InitialiseDB() {

    var adminConnection : mysql.IConnection;

    fs.readFile('./credentials.json', (err, content) => {
        if (err) throw err;

        let credentials: Credentials = JSON.parse(content.toString());

        adminConnection = mysql.createConnection({
            host     : credentials.mysql.host,
            user     : credentials.mysql.adminuser,
            password : credentials.mysql.adminpass
        });

        adminConnection.connect(function(err) {
            if (err) throw err;
            adminConnection.query('CREATE DATABASE IF NOT EXISTS ' + credentials.mysql.db_name, err => {
                if (err) throw err;
                var usr = "'" + credentials.mysql.user + "'@'" + credentials.mysql.host + "'";                
                adminConnection.query("CREATE USER IF NOT EXISTS " + usr + " IDENTIFIED BY '" + credentials.mysql.password + "'", err => {
                    if (err) throw err;
                    adminConnection.query("GRANT ALL PRIVILEGES ON " + credentials.mysql.db_name + " . * TO " + usr, err => {
                        if (err) throw err;
                        adminConnection.end();
                    })
                })
            })
        });
      
    });

}