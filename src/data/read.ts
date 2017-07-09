import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {pool, TABLE_NAME} from './common'
import * as mysql from 'mysql'
import * as contract from './contract'

export interface TrainingFilters {
    after: number | null;
    before: number | null;
    fields?: string[]
}

export function getTrainings(filters: TrainingFilters | null, done: any) {
    pool.getConnection((err, connection) => {
        if (err) {
            done(err);
            return;
        }

        let whereClause = "";
        let whereArgs = [];
        let selection = "*";
        if (filters != null && filters.after != null) {
            whereClause += "date_start >= ?"
            whereArgs.push(filters.after);
        }
        if (filters != null && filters.before != null) {
            if (whereClause.length) { whereClause += " AND " }
            whereClause += "date_start <= ?"
            whereArgs.push(filters.before);
        }
        if (filters != null && filters.fields) {
            selection = connection.escapeId(filters.fields)   // Escape in case dangerous field entered
        } else {
            selection = contract.standard_selection.join(', ')  // Don't escape this since it's server side and contains sql things
        }
        if (whereClause.length) {
            whereClause = " WHERE " + whereClause;
        }
        connection.query("SELECT " + selection + " FROM " + TABLE_NAME + whereClause + " ORDER BY date_start ASC", whereArgs, (err,res)=>{
            connection.release()
            done(err,res)
        });
    })
}

export function readTraining(id : number, done: DataCallback<TrainingSession[]>) {
    pool.getConnection((err, connection) => {
        let a :mysql.IError
        if (err) {
            done(err, null);
            return;
        }
        let selection = contract.standard_selection.join(', ')
        connection.query("SELECT " + selection + " FROM " + TABLE_NAME + " WHERE id=?", [id], (err,res)=>{
            connection.release()
            done(err,res)
        });
    })
}

export function exists(id: number, done: (b:boolean)=>void) {
    readTraining(id, (err, data) => {
        if (err) {
            done(false);
        } else if (data.length == 0) {
            done(false)
        } else {
            done(true)
        }
    })
}