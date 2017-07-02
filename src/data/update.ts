import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import { field_names } from './contract'
import * as mysql from 'mysql'

export function updateTraining(data : TrainingSession, done: any) {
    connection.query("UPDATE " + TABLE_NAME + " SET " + 
        Object.keys(data)
            .map(x => {return x + " = ?"})
            .reduce((x,y,i,a) => {return x + y + ((i==a.length-1)?"":",")}, '')
        + " WHERE id=?",
        Object.keys(data)
            .map(x => {
                return ((data[x]===null) ? "NULL" : data[x].toString())
            })
            .push(data.id), 
        done)
}