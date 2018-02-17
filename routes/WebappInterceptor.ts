import * as express from 'express'
var router = express.Router();

import {StravaService} from "../service/StravaService";

let stravaService: StravaService = new StravaService();


router.get('/',(req,res)=>{
   let athleteId = req.user.id;
    stravaService.countAthleteActivities(athleteId, count => {
       if(count == 0){
           // redirect to onboarding (or simply import some months^^)
           //TODO import more than one page
           stravaService.importLatestActivities(athleteId,()=>{res.send('activities updated')});
       } else {
           // check for new
           stravaService.importLatestActivities(athleteId,()=>{res.send('activities updated')});
       }
    });

   res.send('asfdas');
});




module.exports = router;