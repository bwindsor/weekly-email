import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {pool, TABLE_NAME} from './common'
import * as dbread from './read'
import * as mysql from 'mysql'

export function deleteTraining(id : number, done: any) {
    pool.getConnection((err, connection) => {
        if (err) {
            done(err);
            return;
        }
        dbread.exists(id, doesExist=> {
            if (!doesExist) {
                done({error: 'Record does not exist'})
            } else {
                connection.query("DELETE FROM " + TABLE_NAME + " WHERE id=?", [id], (err,res)=>{
                    connection.release()
                    done(err,res)
                });
            }
        })
    })
}