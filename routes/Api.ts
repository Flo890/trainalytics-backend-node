import * as express from 'express'
var router = express.Router();

router.get('/',(req,res)=>{
    console.log('test');
    res.json({hello:'world'});
});

module.exports = router;