let express = require('express')
let router = express.Router()

router.get('/',(req,res,next)=>{
    //token后端注销不作为。需要前端删除cookie/localstarge里面的token

    //session的删除，需要服务有作为 存时 gtt = 'username + id'
    req.session['gtt'] = undefined
    res.send({err:0,msg:'注销成功'})
})

module.exports = router;