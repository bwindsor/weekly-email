import * as supertest from 'supertest'
import * as trainings from './trainings'
import {createTable} from '../data/create'
import app from '../app'
import * as assert from 'assert'
import {pool, TABLE_NAME} from '../data/common'

assert.notEqual(TABLE_NAME, "trainings")

function deleteTable(done) {
    pool.getConnection((err, connection) => {
        if (err) {
            done(err);
            return;
        }
        connection.query("DROP TABLE " + TABLE_NAME, (err,res)=>{
            connection.release()
            if (err) {
                done(err)
            } else {
                done()
            }
        });
    })
}
function addTestRecord(data, done) {
    pool.getConnection((err, connection) => {
        if (err) {
            done(err);
            return;
        }
        let names = []
        for (let x in data[0]) {names.push(x)}
        let values = data.map(d => {
            let values = [];
            for (let x in d){values.push(d[x])};
            return values
        })
        connection.query("INSERT INTO " + TABLE_NAME + " (" + names.join(',') + ") VALUES ?", [values], (err, data) => {
            connection.release()
            if (err) {
                done(err)
            } else {
                done()
            }
        })
    })
}
function generateExampleShortRecords(n: number, baseDate?: number, dateSpacing?: number) {
    if (!baseDate) {
        baseDate = Math.floor(new Date().getTime()/1000)
    }
    if (!dateSpacing) {
        dateSpacing = 10
    }
    return (new Array(n)).fill(0).map((v,i)=>{
        return {
            id: i+1,
            date_start: baseDate + dateSpacing*i,
            location_name: "TBC",
            start_lat: null,
            start_lon: null
        }
    })
}
function generateExampleLongRecord(shortRecord) {
    return {
        "id": shortRecord.id,
        "date_start": shortRecord.date_start,
        "date_end": null,
        "location_name": shortRecord.location_name,
        "address": null,
        "description": null,
        "start_lat": shortRecord.start_lat,
        "start_lon": shortRecord.start_lon,
        "first_start_time": null,
        "last_start_time": null,
        "parking_lat": null,
        "parking_lon": null,
        "parking_info": null,
        "organiser_name": null,
        "organiser_email": null,
        "organiser_phone": null,
        "club": null,
        "juniors": null,
        "cost_adult": null,
        "cost_junior": null,
        "other_info": null
    }

}

function doDeleteTest(endpoint, dbData, expectedStatusCode, expectedData, done) {
    addTestRecord(dbData, err => {
        if (err) {done(err); return}
        supertest(app)
            .delete(endpoint)
            .expect(expectedStatusCode, expectedData, (err, res) => {
                if (err) {done(err); return}
                if (res.status == 204) {
                    // check it is deleted
                    supertest(app)
                        .get(endpoint)
                        .expect(404, done)
                } else {
                    done()
                }
            })
    })
}

function doGetTest(endpoint, dbData, expectedStatusCode, expectedData, done) {
    addTestRecord(dbData, err => {
        if (err) {done(err); return}
        supertest(app)
            .get(endpoint)
            .expect('Content-Type', /json/)
            .expect(expectedStatusCode, expectedData, done)
    })
}
function doPostTest(endpoint, dbData, expectedStatusCode, postData, expectedResponse, done) {
    addTestRecord(dbData, err => {
        if (err) {done(err); return}
        supertest(app)
            .post(endpoint)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(expectedStatusCode, (err, res) => {
                if (err) {done(err); return}
                if (expectedResponse != null) {
                    assert.deepEqual(res.body, expectedResponse)
                }
                if (res.status == 200) {
                    supertest(app)
                        .get(endpoint + '/' + res.body.id)
                        .expect(postData, done)
                } else {
                    done()
                }
            })
    })
}

function doPutTest(endpoint, dbData, expectedStatusCode, putData, expectedData, done) {
    // This does a put then a get to check that the put worked
    addTestRecord(dbData, err => {
        if (err) {done(err); return}
        supertest(app)
            .put(endpoint)
            .send(putData)
            .expect('Content-Type', /json/)
            .expect(expectedStatusCode, (err, res) => {
                if (err) {done(err); return}
                if (expectedData != null) {
                    assert.deepEqual(res.body, expectedData)
                }
                if (res.status==200) {
                    supertest(app)
                        .get(endpoint)
                        .expect(putData, done)
                } else {
                    done()
                }
            })
    })
}

describe('trainings', () => {
    beforeEach(done => {
        deleteTable(err => {
            if (err) {done(err); return}
            createTable(TABLE_NAME, err => {
                if (err) {done(err)} else {done()}
            })
        })
    })

    describe('GET /trainings', ()=>{
        it('responds with one record available', (done)=>{
            let data = generateExampleShortRecords(1)
            doGetTest('/trainings', data, 200, data, done)
        })
        it('responds with multiple records available', (done)=>{
            let data = generateExampleShortRecords(3)
            doGetTest('/trainings', data, 200, data, done)
        })
    })
    describe('GET /trainings?filters', () => {
        it ('responds with only records after a given time', (done) => {
            let data = generateExampleShortRecords(5)
            let time = Math.floor((data[1].date_start + data[2].date_start)/2)
            doGetTest('/trainings?after='+time.toString(), data, 200, data.slice(2), done)
        })
        it ('includes records where time is equal to the filter time (after)', (done) => {
            let data = generateExampleShortRecords(5)
            let time = data[2].date_start
            doGetTest('/trainings?after='+time.toString(), data, 200, data.slice(2), done)
        })
        it ('responds with only records before a given time', (done) => {
            let data = generateExampleShortRecords(5)
            let time = Math.floor((data[1].date_start + data[2].date_start)/2)
            doGetTest('/trainings?before='+time.toString(), data, 200, data.slice(0,2), done)
        })
        it ('includes records where time is equal to the filter time (before)', (done) => {
            let data = generateExampleShortRecords(5)
            let time = data[2].date_start
            doGetTest('/trainings?before='+time.toString(), data, 200, data.slice(0,3), done)
        })
        it ('responds with only records between given times', (done) => {
            let data = generateExampleShortRecords(5)
            let time1 = Math.floor((data[1].date_start + data[2].date_start)/2)
            let time2 = Math.floor((data[3].date_start + data[4].date_start)/2)
            doGetTest('/trainings?before='+time2.toString() + '&after=' + time1.toString(), data, 200, data.slice(2,4), done)
        })
    })
    describe('GET /trainings/:id', () => {
        it ('returns the requested full training', (done) => {
            let data = generateExampleShortRecords(5)
            doGetTest('/trainings/3', data, 200, generateExampleLongRecord(data[2]), done)
        })
        it('returns 404 for an invalid id', (done) => {
            let data = generateExampleShortRecords(5)
            doGetTest('/trainings/efaf', data, 404, {error:"Resource does not exist"}, done)
        })
    })
    describe('PUT /trainings/:id', () => {
        it('updates the database with modified data', (done) => {
            let data = generateExampleShortRecords(5)
            let putData = generateExampleLongRecord(data[2])
            doPutTest('/trainings/3', data, 200, putData, '', done)
        })
        it('returns 404 for an invalid id', (done) => {
            let data = generateExampleShortRecords(5)
            let putData = generateExampleLongRecord(data[2])
            doPutTest('/trainings/3', data.slice(0,2), 404, putData, {error: "Resource does not exist"}, done)
        })
        it('returns 400 bad request for an id not matching the url', (done) => {
            let data = generateExampleShortRecords(5)
            let putData = generateExampleLongRecord(data[2])
            doPutTest('/trainings/4', data, 400, putData, {error: "Request id does not match url id"}, done)
        })
        it('returns 500 server error for data not matching the db schema', (done) => {
            let data = generateExampleShortRecords(5)
            let putData = generateExampleLongRecord(data[2])
            putData.location_name = null
            doPutTest('/trainings/3', data, 500, putData, null, done)
        })
    })
    describe('POST /trainings', () => {
        it('returns 201 and adds new valid data to the database', (done) => {
            let data = generateExampleShortRecords(5)
            let postData = generateExampleLongRecord(data[4])
            doPostTest('/trainings', data.slice(0,4), 201, postData, {id: 5}, done)
        })
        it('returns 500 server error for invalid data', (done) => {
            let data = generateExampleShortRecords(5)
            let postData = generateExampleLongRecord(data[4])
            postData.location_name = null
            doPostTest('/trainings', data, 500, postData, null, done)
        })
    })
    describe('DELETE /trainings/:id', () => {
        it('deletes an existing training and returns 204 no data', (done) => {
            let data = generateExampleShortRecords(5)
            doDeleteTest('/trainings/3', data, 204, '', done)
        })
        it('returns 404 not found for an invalid id', (done) => {
            let data = generateExampleShortRecords(5)
            doDeleteTest('/trainings/10', data, 404, {error: "Resource does not exist"}, done)
        })
    })
    describe('POST /distribute', () => {
        it('returns 200 and the html email body', (done) => {
            let data = generateExampleShortRecords(5)
            addTestRecord(data, err => {
                if (err) {done(err); return}
                supertest(app)
                    .post('/distribute')
                    .expect('Content-Type',/text\/html/)
                    .expect(200, done)
            })
        })
    })
    describe('POST /distribute?options', () => {
        it('limittoweek=1 returns 200 and a not sent message if no data within a week', (done) => {
            let baseDate = new Date().getTime()/1000 + 86400*8
            let data = generateExampleShortRecords(5, baseDate, 86400)
            addTestRecord(data, err => {
                if (err) {done(err); return}
                supertest(app)
                    .post('/distribute?limittoweek=1')
                    .expect('Content-Type',/application\/json/)
                    .expect(200, {info: "Email not sent because no data within a week"}, done)
            })
        })
        it('limittoweek=1 returns 200 and html if data within a week', (done) => {
            let baseDate = new Date().getTime()/1000 + 86400*4
            let data = generateExampleShortRecords(5, baseDate, 86400)
            addTestRecord(data, err => {
                if (err) {done(err); return}
                supertest(app)
                    .post('/distribute?limittoweek=1')
                    .expect('Content-Type',/text\/html/)
                    .expect(200, done)
            })
        })
    })
})
