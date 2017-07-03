import {Credentials} from './types.d'
import * as fs from 'fs';

let content = fs.readFileSync('./credentials.json');
let credentials: Credentials = JSON.parse(content.toString());

export default credentials