let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')

router.post('/',(req,res,next)=>{
    mgdb.open({
        collectionName:'user'
    }).then(
        ({collection,client,ObjectId}) =>{
            collection.find({
                username:req.query.decode.username,_id: ObjectId(req.query.decode._id)
            }).toArray((err,result) =>{
                if(err){
                    res.send({err:1,msg:'集合操作失败'})
                    client.close()
                }else{
                    //判断用户是否存在
                    if(result.length > 0){
                        delete result[0].username;
                        delete result[0].password;
                        res.send({err:0,msg:'自动登录成功',data:result[0]})
                    }else{
                        res.send({err:1,msg:'自动登录失败'})
                    }
                    client.close()
                }
            })
        }
    )
})

module.exports = router;