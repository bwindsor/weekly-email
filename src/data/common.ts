import * as mysql from 'mysql'
import * as fs from 'fs'
import credentials from './credentials'

export const TABLE_NAME = process.env.TABLE_NAME || ((process.env.TEST_ENVIRONMENT=="1")?"trainings_test": "trainings");
export var pool : mysql.IPool;

pool  = mysql.createPool({
  host     : credentials.mysql.host,
  user     : credentials.mysql.user,
  password : credentials.mysql.password,
  database : credentials.mysql.db_name,
  port     : credentials.mysql.port
});