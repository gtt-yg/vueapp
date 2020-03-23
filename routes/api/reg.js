let express = require('express')
let router = express.Router()
let fs = require ('fs')
let pathLib = require('path')
let mgdb = require('../../utils/mgdb')
let bscrypt = require('../../utils/bcrypt')


router.post('/',(req,res,next)=>{
    //1获取username password,nikename,icon
    let {username,password,nikename} = req.body;
    //2、必传参3数做校验 username password
    if(!username || !password){
        res.send({
            err:1,
            msg:'用户名或者密码不能为空'
        })
        return;
    }
    //3、整理其他未来需要入库的参数，time nikename 头像|默认存到对应服务器磁盘follow,fans
    nikename = nikename || '小玉';//npm 下载自动生成昵称的包
    let follow = 0;
    let fans = 0;
    let time = Date.now();//服务器生成注册时间
    let icon = '/upload/my.jpg';//默认头像
    let ass = 0;//点赞
    let up = 0;//头条
    //判断用户是否有传递头像
    if (req.files && req.files.length > 0) {
        //图片加后缀 覆盖默认头像
    
        //改名
        fs.renameSync(
          req.files[0].path,
          req.files[0].path + pathLib.parse(req.files[0].originalname).ext
        )
    
        //覆盖默认头像
        icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
    
      }
    //4、兜库用户是否存在的校验
    //5、链接库 open
    mgdb.open({
        dbName:'newsapp',
        collectionName:'user'
    }).then(
        ({collection, client}) => {
    //6、查询
    collection.find({username}).toArray((err,result) =>{
        if(err){
            res.send({err:1,msg:'集合操作失败'})
            client.close()
        }else{
            if(result.length === 0){
            //8、用户不存在 参数入库
                //密码加密
                password = bscrypt.hashSync(password)
                //入库
                collection.insertOne({
                    username,password,nikename,fans,follow,time,icon,ass,up
                },(err,result) =>{
                    if(!err){
                        delete result.ops[0].username;
                        delete result.ops[0].password;
                        res.send({
                            err:0,msg:'注册成功',
                            data: result.ops[0]
                        })
                        client.close()
                    }else{//入库失败
                        res.send({err:1,msg:'注册失败'})
                        client.close()
                    }
                })

            }else{
                //7、用户存在删除后的头像 不能删除默认头像
                if(icon.indexOf('my') == -1){
                    fs.unlinkSync('./public' + icon)
                }
                res.send({err:1,msg:'用户名已存在'})
                client.close()
            }
        }
    })
    
    
        }
    ).catch(
        err => res.send(err)
    )
    
})

module.exports = router;