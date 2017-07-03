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
    let fields_to_use = field_names.filter(x => {return (x != "id") && (data[x] != null)});
    connection.query("INSERT INTO " + TABLE_NAME + " (" + 
        fields_to_use
            .reduce((x,y,i,a) => {return x+y+((i==a.length-1)?"":",")}, '') +
    ") VALUES (" + Array(fields_to_use.length).join("?,") + "?)", 
    fields_to_use.map(f => {return data[f].toString()}),
    done)
}
