import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import * as dbread from './read'
import * as mysql from 'mysql'

export function deleteTraining(id : number, done: any) {
    dbread.exists(id, doesExist=> {
        if (!doesExist) {
            done({error: 'Record does not exist'})
        } else {
            connection.query("DELETE FROM " + TABLE_NAME + " WHERE id=?", [id], done);
        }
    })
}