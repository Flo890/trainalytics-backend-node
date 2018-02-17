"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    console.log('test');
    res.json({ hello: 'world' });
});
module.exports = router;
