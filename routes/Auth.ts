import * as express from 'express'
var router = express.Router();
import * as  passport from 'passport'
import {Strategy as StravaStrategy} from 'passport-strava-oauth2'

import {StravaService} from "../service/StravaService";
import {Config} from "../Config";

let stravaService: StravaService = new StravaService();

passport.use(new StravaStrategy({
        clientID: Config.STRAVA_CLIENT_ID(),
        clientSecret: Config.STRAVA_CLIENT_SECRET(),
        callbackURL: "http://127.0.0.1:3000/auth/strava/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            stravaService.isAthleteImported(profile.id,(exists: boolean)=>{
                if(!exists){
                    stravaService.addAthlete(profile, accessToken);
                }
            });
            // To keep the example simple, the user's Strava profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Strava account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


router.get('/login',(req,res)=>{
    res.render('login');
});
router.get('/auth/strava/login/do',
    passport.authenticate('strava',{scope: ['view_private']})
);

router.get('/auth/strava/callback',
    passport.authenticate('strava', { failureRedirect: '/login' }),
    function(req, res, next) {
        // Successful authentication, redirect home.
        console.log('successful authentication');
        //res.redirect('/test/account');
        res.redirect('/webappinterceptor')
    });


module.exports = router;