var express = require('express');
var router = express.Router();
var jwt = require('../utils/jwt')

/* GET home page. */
router.get('/', function(req, res, next) {
  /* console.log('session',req.session)
  console.log('!address',req.body)
  console.log('address',req.query) */

  console.log('test');
});

module.exports = router;
