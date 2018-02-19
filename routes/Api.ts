import * as express from 'express'
import {StravaService} from "../service/StravaService";
var router = express.Router();

let stravaService: StravaService = new StravaService();

router.get('/',(req,res)=>{
    console.log('test');
    res.json({hello:'world'});
});

router.get('/activitiesstats',(req,res)=>{
    const athleteId: number = req.user.id;

    stravaService.findAthleteActivitiesStats(athleteId, docs => {
        if(docs) {
            res.json(docs);
        } else {
            res.sendStatus(500);
        }
    });
});

module.exports = router;