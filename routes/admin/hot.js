let express = require('express')
let router = express.Router();
let mgdb = require('../../utils/mgdb')
let fs = require('fs')
let pathLib = require('path')


//增加
router.post('/',(req,res,next) =>{
    let {content,title,from,comments,auth,} = req.body;
    let time = Date.now()

    
    mgdb.open({
        collectionName:'hot'
    }).then(
        ({collection,client}) => {
            let data = {title,time,from,comments,detail:{auth,content}}
            collection.insertOne(
                data,(err, result) =>{
                    if(!err && result.result.n > 0){
                        res.send({err:0, msg: '添加成功', data:{_id:result.insertedId,...data}})
                    }else{
                        res.send({err:1,msg: '添加失败'})
                    }
                    client.close()
                }
            )
        }
    )
})

module.exports = router;