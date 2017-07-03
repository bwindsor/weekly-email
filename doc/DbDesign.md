# Database design
## Table: `training_nights`
Field | Definition | Description
----- | ---------- | -----------
`id` | INT PRIMARY KEY NOT NULL AUTO INCREMENT | Unique ID for the training evening
`date_start` | BIGINT NOT NULL | Unix time for the start of the event
`date_end` | BIGINT | Optional unix time for the end of the event
`location_name` | CHAR(50) NOT NULL | Name of the location
`address`| VARCHAR(1000) | Optional address of the location
`description` | VARCHAR(2000) | Optional description of the training (e.g. which techniques)
`start_lat` | DECIMAL(10,7) | Latitude of the start
`start_lon` | DECIMAL(10,7) | Longitude of the start
`first_start_time` | TIME | Earliest start time
`last_start_time` | TIME | Latest start time
`parking_lat` | DECIMAL(10,7) | Latitude of the car park
`parking_lon` | DECIMAL(10,7) | Longitude of the car park
`parking_info` | VARCHAR(2000) | Further information about parking e.g. restrictions, cost
`organiser_name` | CHAR(50) | Name of the organiser
`organiser_email` | CHAR(100) | Contact email for the organiser
`organiser_phone` | CHAR(20) | Contact phone for the organiser
`club` | CHAR(10) | Name of the organising club
`juniors` | BOOLEAN | Whether this is suitable for juniors
`cost_adult` | DECIMAL(8,2) | Cost for the session per adult
`cost_junior` | DECIMAL(8,2) | Cost for the session per junior/student
`other_info` | VARCHAR(2000) | Any other specific information e.g. health and safety, which shoes to wear