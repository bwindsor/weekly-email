import {Credentials} from './types.d'
import * as fs from 'fs';

let content = fs.readFileSync(fs.existsSync('./credentials.json')?'./credentials.json':'./credentials_template.json');
let credentials: Credentials = JSON.parse(content.toString());
// Override with anything set in the environment
credentials = {
    ...credentials,
    mysql: {
        host: parseEnv('RDS_HOSTNAME', credentials.mysql.host),
        db_name: parseEnv('RDS_DB_NAME', credentials.mysql.db_name),
        user: parseEnv('RDS_USERNAME', credentials.mysql.user),
        password: parseEnv('RDS_PASSWORD', credentials.mysql.password),
        adminuser: parseEnv('RDS_ROOT_USER', credentials.mysql.adminuser),
        adminpass: parseEnv('RDS_ROOT_PASS', credentials.mysql.adminpass),
        port: Number.parseInt(process.env.RDS_PORT) || credentials.mysql.port || 3306
    }
}
export default credentials

function parseEnv(varName, defaultValue) {
    let v = process.env[varName]
    if (v===undefined) {
        return defaultValue
    } else {
        return v
    }
}