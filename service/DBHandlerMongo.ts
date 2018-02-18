import * as mongo from 'mongodb'
import * as monk from 'monk'
import {Config} from "../Config";

export class DBHandlerMongo {
    private db

    constructor(){
        this.db = monk(Config.MONGODB_CONNECT_URL())
    }

    public getStravaUser(athleteId: number, successCallback: Function, notFoundCallback: Function) {
        let collection = this.db.get('athletes');
        //check if athlete already exists
        collection.findOne({id: athleteId}, function (err, item) {
            if(item && item.id == athleteId){
                successCallback(item);
            } else {
                notFoundCallback();
            }

        });
    }

    public addAthlete(athlete: Object, callback: Function){
        let collection = this.db.get('athletes');
        collection.insert(athlete,()=>{
            //success
            console.log(`inserting athlete ${athlete.id} into database successful`);
            callback();
        },()=>{
            //failure
            console.error(`inserting athlete into database failed`);
            callback();
        });
    }

    public addAccessToken(athleteId: number, accessToken: string, callback: Function){
        let collection = this.db.get('accesstokens');
        collection.insert({
            athleteId: athleteId,
            accessToken: accessToken
        },()=>{
            //success
            console.log(`inserted accessToken successful`);
            callback();
        }, ()=>{
            //failure
            console.error(`inserting accessToken failed`);
            callback();
        })
    }

    public getAccessTokenByAthleteId(athleteId: number, callback: Function): void {
        let collection = this.db.get('accesstokens');
        collection.findOne({athleteId: athleteId},(err,item)=>{
            if(item && item.accessToken){
                callback(item.accessToken);
            } else {
                callback(null);
            }
        });
    }

    public countAthleteActivities(athleteId: number, callback: Function): void {
        let collection = this.db.get('activities');
        collection.count({athleteId: athleteId},(err,count)=>{
            callback(count);
        });
    }

    public insertOrUpdateActivity(athleteId: number, activity: Object, callback: Function): void {
        const collection = this.db.get('activities');
        collection.update(
            {activityId: activity.id}, // filter
            {  // item
                activityId: activity.id,
                athleteId: athleteId,
                importTime: new Date(),
                summaryActivity: activity
        }, // options, callback
            {upsert:true, w: 1}, function(err, result) {
                if(err){
                    console.error(`could not upsert activitiy`,err);
                } else {
                    console.log(`upserted activity ${activity.id} for athlete ${athleteId}`);
                }
            callback();
        })
    }

    public findLatestAthleteActivity(athleteId: number, callback: Function): void {
        let collection = this.db.get('activities');
        collection.find({athleteId: athleteId},{sort:{activityId:-1},limit:1}).then(docs => {
            callback(docs.length > 0 ? docs[0] : null);
        });

    }

    public findAthleteActivitiesStats(athleteId: number, afterEpochTs: number, callback: Function): void {
        const fields = {
            type: 1, // Ride, Run, ...
            moving_time: 1, // in seconds
            start_date_local: 1,
            name: 1,
            description: 1
        }

        const collection = this.db.get('activities');
        collection.find(
            {athleteId: athleteId, start_date_local:{$gte: afterEpochTs}},
            {fields: fields, sort:{start_date_local:1}}
        ).then(docs => {
            callback(docs);
        }).catch(reason => {
            console.error(`could not find activities. reason: ${reason}`);
            callback(null);
        })
    }


}