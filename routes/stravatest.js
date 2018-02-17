"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.get('/account', function (req, res) {
    res.render('account', { user: req.user });
});
module.exports = router;
