import {DBHandlerMongo} from "./DBHandlerMongo";
import * as StravaApiV3 from 'strava_api_v3'

export class StravaService {
    private dbHandlerMongo: DBHandlerMongo

    constructor(){
        this.dbHandlerMongo = new DBHandlerMongo();
    }

    public isAthleteImported(athleteId: number, callback: Function): void {
        this.dbHandlerMongo.getStravaUser(athleteId, () => {
            console.log(`athlete ${athleteId} exists in database`);
            callback(true);
        },()=>{
            console.log(`athlete ${athleteId} does not exist in database`);
            callback(false);
        });
    }

    public addAthlete(athlete: Object, accessToken: string): void {
        this.dbHandlerMongo.addAthlete(athlete,()=>{
            this.dbHandlerMongo.addAccessToken(athlete.id,accessToken,()=>{});
        });
    }

    public countAthleteActivities(athleteId: number, callback: Function): void {
        this.dbHandlerMongo.countAthleteActivities(athleteId, count => {
            callback(count);
        })
    }

    public importLatestActivities(athleteId: number, callback: Function): void {

        this.dbHandlerMongo.getAccessTokenByAthleteId(athleteId, accessToken => {

            fetch(
                'https://www.strava.com/api/v3/athlete/activities',
                {
                    headers: {
                        'Authorization': 'Bearer '+accessToken
                    }
                }
            ).then(response => {
                response.json().then(function(data) {
                    console.log('API called successfully.');
                    data.forEach(aSummaryActivity => {
                        this.dbHandlerMongo.insertOrUpdateActivity(athleteId, aSummaryActivity, ()=>{});
                    });
                })
            });


        })


    }
}