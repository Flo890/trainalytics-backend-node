var express = require('express');
var router = express.Router();

router.get('/account',(req,res)=>{
    res.render('account',{user:req.user});
});

module.exports = router;