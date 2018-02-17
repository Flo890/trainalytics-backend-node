import * as express from 'express'
var router = express.Router();

import {StravaService} from "../service/StravaService";
import {Utils} from "../service/Utils";

let stravaService: StravaService = new StravaService();


router.get('/',(req,res)=>{
   let athleteId = req.user.id;
    stravaService.findLatestAthleteActivity(athleteId, activitySummary => {
        // if not data exist yet, import the last 90 days, otherwise the last 2 weeks
       let after: Date = activitySummary == null ? Utils.substractDaysFromDate(new Date(),90) : Utils.substractDaysFromDate(new Date(activitySummary.summaryActivity.start_date),14);
       console.log(`set after date to ${after.getUTCDate()}`);

       stravaService.importActivitiesFromTo(athleteId, null, after,1,()=>{res.redirect('/webapp')});

    });
});

module.exports = router;