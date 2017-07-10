# API Design
Example `JSON` response for training request:
```Json
{
    "id": 5,
    "date_start": 149536552,
    "date_end": 149536553,
    "location_name": "Wandlebury",
    "address": null,
    "description": "Map memory",
    "start_lat": 52.3365,
    "start_lon": 0.2536,
    "first_start_time": "18:00",
    "last_start_time": "18:30",
    "parking_lat": 52.3360,
    "parking_lon": 0.2542,
    "parking_info": "Cost £3. Parking closes at 10pm",
    "organiser_name": "Ben Windsor",
    "organiser_email": "benwindsor@gmail.com",
    "organiser_phone": null,
    "club": "DRONGO",
    "juniors": 1,
    "cost_adult": 3,
    "cost_junior": 1.5,
    "other_info": "Orienteering shoes are recommended"
}
```

## Get a single session
`GET /trainings/:id`

The response should look like the example above.

## Get a list of sessions
`GET /trainings?filters`

Filter name | Type | Required | Description
----------- | ---- | -------- | -----------
after | integer | no | Get trainings after this Unix time
before | integer | no | Get trainings after this Unix time

The response is an array of simple training information, as shown in the example:
```Json
[
    {
        "id": 0,
        "date_start": 149663225,
        "location_name": "Wandlebury",
        "start_lat": 52.1111,
        "start_lon": 0.1234
    },
    {
        "id": 7,
        "date_start": 149558023,
        "location_name": "TBC",
        "start_lat": null,
        "start_lon": null
    }
]
```

## Update a session
`PUT /trainings/:id`

Request body should be the same as the example - but the `id` field, if present, is ignored since this is specified by the request path.

Returns `200 OK` if the update was successful.

## Create a session
`POST /trainings`

Request body should be the same as the example - but the `id` field, if present, is ignored since this is created by the server.

Returns `201 CREATED` with body containing JSON object containing just the `id` field, such as `{"id": 5}`

## Delete a session
`DELETE /trainings/:id`

Returns a `204 NO CONTENT` response if delete was successful.

## Send the weekly email for a session
`POST /distribute?options`

The query string can be omitted, or can include the following
Option name | Type | Required | Description
----------- | ---- | -------- | -----------
test | boolean (0 or 1) | no | Default 1. Whether this should be sent as a test message.
limittoweek | boolean (0 or 1) | no | Default 0. If 1, the email is only sent if a training exists within one week of midnight at the end of the current day.

Note the query string include `?test=0` in order to send the actual weekly email. Be default a test message is sent.

The message body should contain the following JSON:
* `to` - email address to send the message to
* `welcome_text` - optional, can contain a welcome message to go at the top of the email. This should be an array of strings, corresponding to paragraphs.
```Json
{
    "to": "youraddress@yourdomain.com"
    "welcome_text": ["Hi all,", "This is the first email from me!", "Ben"]
}
```

Returns `200 OK` if the send was successful.

## Send the weekly email (no auth)
`POST /send-the-weekly-email?options
This is useful when in AWS and a cronjob `POST`s to an endpoint to execute a task. This behaves in exactly the same was as `POST /distribute`, but requires username and password to be supplied in the query string.
Option name | Type | Required
----------- | ---- | --------
username | string | yes
password | string | yes
test | boolean (0 or 1) | no
limittoweek | boolean (0 or 1) | no