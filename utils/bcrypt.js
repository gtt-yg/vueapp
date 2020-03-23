let bcrypt = require('bcryptjs')

module.exports = {
    //加密
    hashSync:(password)=>{
        return bcrypt.hashSync(password, 10);
    },
     //解密
    compareSync : (sendPassWord, hash) => bcrypt.compareSync(sendPassWord, hash)
}