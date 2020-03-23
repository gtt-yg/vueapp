let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
let bcrypt = require('../../utils/bcrypt')
let jwt = require('../../utils/jwt')


router.post('/',(req,res,next)=>{
    
    //1获取username password
    let {username,password} = req.body;
    if(!username || !password){
        res.send({
            err:1,
            msg:'用户名密码为必传参数'
        })
        return;
    }
    
    mgdb.open({
        collectionName:'user'
    }).then(
        ({collection,client})=>{
            
            collection.find({
                username
            }).toArray((err,result) => {
                if(err){
                    res.send({err:1,msg:'集合操作失败',err:err})
                    client.close()
                }else{
                    if(result.length > 0){
                        let bl = bcrypt.compareSync(password,result[0].password)
                        console.log(bl)
                        if(bl){
                            let token = jwt.sign({username,_id:result[0]._id})
                            delete result[0].username;
                            delete result[0].password;
                            res.send({err:0,msg:'登录成功',data:result[0],token})
                        }else{
                            res.send({err:1,msg:'用户名或密码有误'})
                        }
                    }else{
                        res.send({err:1,msg:'用户名或密码有误'})
                    }
                    client.close()
                }
            })
        }
    ).catch(
        err =>res.send({err:1,msg:'集合操作失败'})
    )
    
})

module.exports = router;