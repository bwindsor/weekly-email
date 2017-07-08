import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import { field_names } from './contract'
import * as mysql from 'mysql'
import * as dbread from './read'

export function updateTraining(data : TrainingSession, done: any) {
    
    dbread.exists(data.id, doesExist=> {
        if (!doesExist) {
            done({error: "Record for that ID does not exist"})
        } else {
            connection.query("UPDATE " + TABLE_NAME + " SET ? WHERE ID=?", [data, data.id], done)
        }
    })
}