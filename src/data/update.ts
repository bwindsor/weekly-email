import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import { field_names } from './contract'
import * as mysql from 'mysql'
import * as dbread from './read'

export function updateTraining(data : TrainingSession, done: any) {
    let keys = Object.keys(data).filter(x => {return (x!="id") && (data[x] != null)});
    let values = keys.map(x => { return data[x].toString() });
    values.push(data.id);
    
    dbread.readTraining(data.id, (err, data) => {
        if (err) {
            done(err);
        } else if (data.length == 0) {
            done({error: "Record for that ID does not exist"})
        } else {
            connection.query("UPDATE " + TABLE_NAME + " SET " + 
                keys
                    .map(x => {return x + " = ?"})
                    .reduce((x,y,i,a) => {return x + y + ((i==a.length-1)?"":",")}, '')
                + " WHERE id=?",
                values,
                done
            )
        }
    })
}