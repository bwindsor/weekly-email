import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import {field_definitions, field_names} from './contract'
import * as mysql from 'mysql'

createTable(TABLE_NAME);

export function createTable(table_name: string) {
    connection.query("CREATE TABLE IF NOT EXISTS " + table_name + " (" + 
    field_definitions.reduce((x,y,i,a)=>{return x+field_names[i]+ " " + y + ((i==a.length-1)?"":",")}, "")
    + ")", err => {
        if (err) throw err;
    });
}

export function createTraining(data : NewTrainingSession, done: DataCallback<TrainingSession>) {
    connection.query("INSERT INTO " + TABLE_NAME + " (" + 
        field_names
            .filter(x => x != "id")
            .reduce((x,y,i,a) => {return x+y+((i==a.length-1)?"":",")}, '') +
    ") VALUES (" + Array(field_names.length).join("?,") + "?)", 
    field_names.map(f => {return (data[f] === null) ? "NULL" : data[f].toString()}),
    done)
}
