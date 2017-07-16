import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {pool, TABLE_NAME} from './common'
import { field_names } from './contract'
import * as mysql from 'mysql'
import * as dbread from './read'

export function updateTraining(data : TrainingSession, done: (err?:any)=>void) {
    pool.getConnection((err, connection) => {
        if (err) {
            done(err);
            return;
        }
        dbread.exists(data.id, doesExist=> {
            if (!doesExist) {
                done({error: "Record for that ID does not exist"})
            } else {
                connection.query("UPDATE " + TABLE_NAME + " SET ? WHERE ID=?", [data, data.id], (err,res)=>{
                    connection.release()
                    if (!err && res.affectedRows == 0) {
                        done("Update did not change any rows.")
                    } else {
                        done(err) // Err could be undefined in which case this is done with no error
                    }
                })
            }
        })
    })
}