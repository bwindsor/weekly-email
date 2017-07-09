import {Credentials} from './types.d'
import * as fs from 'fs';

let content = fs.readFileSync('./credentials.json');
let credentials: Credentials = JSON.parse(content.toString());
if (!credentials.mysql) {
    credentials = {
        ...credentials,
        mysql: {
            host: process.env.RDS_HOSTNAME + ':' + process.env.RDS_PORT,
            db_name: process.env.RDS_DB_NAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            adminuser: "",
            adminpass: "",
            port: Number.parseInt(process.env.RDS_PORT)
        }
    }
} else if (!credentials.mysql.port) {
    credentials.mysql.port = 3306
}
export default credentials