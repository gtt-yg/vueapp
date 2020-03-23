let jwt = require('jsonwebtoken');

module.exports = {
    //生成签名
    sign:({username,_id})=>{
        return jwt.sign({username,_id},'gtt',{expiresIn:60*60*24})//过期时间以秒结束
    },

    //校验签名
    verify:(token)=>{
        return new Promise((resolve,reject)=>{
            jwt.verify(token,'gtt',(err,decode)=>{
                if(!err){
                    resolve(decode)//decode 校验成功后，返回的一个对象{username;'alex'，_id:'2322'}
                }else{
                    reject(err.message)//校验失败，err=={key:value,message:'...'}
                }
            })
        })
    }
}