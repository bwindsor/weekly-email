import {Credentials} from './types.d'
import * as fs from 'fs';

let content = fs.readFileSync(process.env.TEST_ENVIRONMENT=="1"?'./credentials_template.json':'./credentials.json');
let credentials: Credentials = JSON.parse(content.toString());
// Override with anything set in the environment
credentials = {
    ...credentials,
    mysql: {
        host: process.env.RDS_HOSTNAME || credentials.mysql.host,
        db_name: process.env.RDS_DB_NAME || credentials.mysql.db_name,
        user: process.env.RDS_USERNAME || credentials.mysql.user,
        password: process.env.RDS_PASSWORD || credentials.mysql.password,
        adminuser: process.env.RDS_ROOT_USER || credentials.mysql.adminuser,
        adminpass: process.env.RDS_ROOT_PASS || credentials.mysql.adminpass,
        port: Number.parseInt(process.env.RDS_PORT) || credentials.mysql.port || 3306
    }
}
export default credentials