export interface NewTrainingSession {
    date_start: number,
    date_end: number | null,
    location_name: string,
    address: string | null,
    description: string | null,
    start_lat: number | null,
    start_lon: number | null,
    first_start_time: string | null,
    last_start_time: string | null,
    parking_lat: number | null,
    parking_lon: number | null,
    parking_info: string | null,
    organiser_name: string | null,
    organiser_email: string | null,
    organiser_phone: string | null,
    club: string | null,
    juniors: boolean | null,
    cost_adult: number | null,
    cost_junior: number | null,
    other_info: string | null
}

export interface TrainingSession extends NewTrainingSession {
    id: number
}