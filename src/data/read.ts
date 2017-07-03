import {TrainingSession, NewTrainingSession, DataCallback} from "./types.d"
import {connection, TABLE_NAME} from './common'
import * as mysql from 'mysql'

export interface TrainingFilters {
    after: number | null;
    before: number | null;
}

export function getTrainings(filters: TrainingFilters | null, done: any) {
    let whereClause = "";
    let whereArgs = [];
    if (filters != null && filters.after != null) {
        whereClause += "date_start >= ?"
        whereArgs.push(filters.after);
    }
    if (filters != null && filters.before != null) {
        if (whereClause.length) { whereClause += " AND " }
        whereClause += "date_end <= ?"
        whereArgs.push(filters.before);
    }
    if (whereClause.length) {
        whereClause = " WHERE " + whereClause;
    }
    connection.query("SELECT * FROM " + TABLE_NAME + whereClause + " ORDER BY date_start ASC", whereArgs, done);
}

export function readTraining(id : number, done: DataCallback<TrainingSession>) {
    connection.query("SELECT * FROM " + TABLE_NAME + " WHERE id=?", [id], done);
}