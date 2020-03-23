let express = require('express')
let router = express.Router();
let mgdb = require('../../utils/mgdb')
let fs = require('fs')
let pathLib = require('path')


//增加
router.post('/',(req,res,next) =>{
    let {content,title,from,comments,auth,} = req.body;
    let time = Date.now()

    let images1,images2,images3;
    req.files && req.files.forEach((file,index) =>{
        if(file.fieldname === 'images1'){
            images1 = '/upload/product/' + file.filename + pathLib.parse(file.originalname).ext;
        }
        if(file.fieldname === 'images2'){
            images2 = '/upload/product/' + file.filename + pathLib.parse(file.originalname).ext;
        }
        if(file.fieldname === 'images3'){
            images3 = '/upload/product/' + file.filename + pathLib.parse(file.originalname).ext;
        }

        fs.renameSync(file.path,file.path+pathLib.parse(file.originalname).ext)
    })
    if(!images1) images1 = ''
    if(!images2) images2 = ''
    if(!images3) images3 = ''

    
    mgdb.open({
        collectionName:'movies'
    }).then(
        ({collection,client}) => {
            let data = {title,time,from,comments,detail:{images1,images2,images3,auth,content}}
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