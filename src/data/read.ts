import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import * as mysql from 'mysql'

export interface TrainingFilters {
    after: number | null;
    before: number | null;
    fields?: string[]
}

export function getTrainings(filters: TrainingFilters | null, done: any) {
    let whereClause = "";
    let whereArgs = [];
    let selection = "*";
    if (filters != null && filters.after != null) {
        whereClause += "date_start >= ?"
        whereArgs.push(filters.after);
    }
    if (filters != null && filters.before != null) {
        if (whereClause.length) { whereClause += " AND " }
        whereClause += "date_end <= ?"
        whereArgs.push(filters.before);
    }
    if (filters != null && filters.fields) {
        selection = connection.escapeId(filters.fields)   // Escape in case dangerous field entered
    }
    if (whereClause.length) {
        whereClause = " WHERE " + whereClause;
    }
    connection.query("SELECT " + selection + " FROM " + TABLE_NAME + whereClause + " ORDER BY date_start ASC", whereArgs, done);
}

export function readTraining(id : number, done: DataCallback<TrainingSession[]>) {
    connection.query("SELECT * FROM " + TABLE_NAME + " WHERE id=?", [id], done);
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