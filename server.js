/*
 * @Author: Yuk
 * @Date:   2016-05-08 14:52:09
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-12 22:00:01
 */

'use strict';

var express = require('express');
var path = require('path');
var app = express();
var port = 6001;

app.use(express.static(__dirname + '/dist'));
app.get('/', function(req, res) {})
app.listen(port);
console.log('server listening on port ' + port);
