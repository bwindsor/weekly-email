import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {pool, TABLE_NAME, validateTraining} from './common'
import {field_definitions, field_names} from './contract'
import * as mysql from 'mysql'

createTable(TABLE_NAME);

export function createTable(table_name: string, done?: any) {
    pool.getConnection((err, connection) => {
        if (err) {
            if (done) {done(err); return} else {throw err}
        }
        connection.query("CREATE TABLE IF NOT EXISTS " + table_name + " (" + 
        field_definitions.reduce((x,y,i,a)=>{return x+field_names[i]+ " " + y + ((i==a.length-1)?"":",")}, "")
        + ")", err => {
            connection.release()
            if (err) {
                if (done) {done(err)} else {throw err};
            }
            if (done) {done()}
        })
    })
}

export function createTraining(data : NewTrainingSession, done: DataCallback<TrainingSession>) {
    if (!validateTraining({...data, id: 0})) {
        done("Data was not valid.", null)
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            done(err, null);
            return;
        }
        let fields_to_use = field_names.filter(x => {return (x != "id") && (data[x] != null)});
        connection.query("INSERT INTO " + TABLE_NAME + " (" + 
            fields_to_use
                .reduce((x,y,i,a) => {return x+y+((i==a.length-1)?"":",")}, '') +
        ") VALUES (" + Array(fields_to_use.length).join("?,") + "?)", 
        fields_to_use.map(f => {return data[f].toString()}),
        (err,res)=>{
            connection.release()
            done(err,res)
        })
    })
}
