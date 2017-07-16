import * as mysql from 'mysql'
import * as fs from 'fs'
import credentials from './credentials'
import {TrainingSession} from './types.d'

export const TABLE_NAME = process.env.TABLE_NAME || ((process.env.TEST_ENVIRONMENT=="1")?"trainings_test": "trainings");
export var pool : mysql.IPool;

let poolOptions:mysql.IPoolConfig = {
  host     : credentials.mysql.host,
  user     : credentials.mysql.user,
  database : credentials.mysql.db_name,
  port     : credentials.mysql.port
}

if (credentials.mysql.password.length > 0) {
  poolOptions = {
    ...poolOptions,
    password : credentials.mysql.password
  }
}

pool  = mysql.createPool({
  host     : credentials.mysql.host,
  user     : credentials.mysql.user,
  password : credentials.mysql.password,
  database : credentials.mysql.db_name,
  port     : credentials.mysql.port
});

export function validateTraining(training: TrainingSession) {
    return (
      training.location_name != null &&
      training.date_start != null &&
      (training.juniors == null || training.juniors == true || training.juniors == false)
    )
}