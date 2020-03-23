var express = require('express');
var router = express.Router();
var jwt = require('../utils/jwt')

/* GET home page. */
router.get('/', function(req, res, next) {
  /* console.log('session',req.session)
  console.log('!address',req.body)
  console.log('address',req.query) */

  let token = jwt.sign({username:'alex', _id:33333333});
  console.log('token',token)
  jwt.verify(token).then(
    decode=>console.log('校验',decode)
  ).catch(
    err=>console.log('失败',err)
  )

  res.render('index', { title: 'Express' });
});

module.exports = router;
