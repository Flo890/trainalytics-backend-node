import {DBHandlerMongo} from "./DBHandlerMongo";
import fetch from 'node-fetch'
import {Utils} from "./Utils";

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

    public findLatestAthleteActivity(athleteId: number, callback: Function): void {
        this.dbHandlerMongo.findLatestAthleteActivity(athleteId, callback);
    }

    public importActivitiesFromTo(athleteId: number, before: Date, after: Date, page: number = 1, callback: Function): void {
        let thisref = this;
        const itemsPerPage = 30;
        this.dbHandlerMongo.getAccessTokenByAthleteId(athleteId, accessToken => {
            const queryUrl = `https://www.strava.com/api/v3/athlete/activities?per_page=${itemsPerPage}&page=${page}${before==null ? '' :'&before='+Utils.getEpochTime(before)}${after==null ? '' : '&after='+Utils.getEpochTime(after)}`;
            console.log(`will fetch ${queryUrl}`);
            fetch(
                queryUrl,
                {
                    headers: {
                        'Authorization': 'Bearer '+accessToken
                    }
                }
            ).then(response => {
                response.json().then(function(data) {
                    console.log('API called successfully.');
                    let promises: Promise[] = [];
                    if(response.status == 200 &&  data instanceof Array) {
                        data.forEach(aSummaryActivity => {
                            promises.push(new Promise((resolve, reject) => {
                                thisref.dbHandlerMongo.insertOrUpdateActivity(athleteId, aSummaryActivity, resolve);
                            }));
                        });
                        Promise.all(promises).then(() => {
                            if (after != null && data.length == itemsPerPage) {
                                // load the next page, if this one was full (recursive)
                                thisref.importActivitiesFromTo(athleteId, before, after, page + 1, callback);
                            } else {
                                callback();
                            }
                        }).catch(reason => {
                            console.error('fetch activities summaries db-import promise was rejected', reason);
                        });
                    } else {
                        console.error(`fetching activities summaries failed: ${response.status}, ${response.statusText}`);
                    }
                })
            }).catch(reason => {
                console.error('fetch activities summaries fetch promise was rejected',reason);
            });
        }
    }
}