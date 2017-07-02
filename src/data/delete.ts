import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import * as mysql from 'mysql'

export function deleteTraining(id : number, done: any) {
    connection.query("DELETE FROM " + TABLE_NAME + " WHERE id=?", [id], done);
}