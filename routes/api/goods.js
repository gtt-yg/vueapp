let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')


router.get('/:goodsname',(req,res,next)=>{


    
    
    //判断是否含有id参数，分出业务到详情
    if(req.query._id){
        res.redirect(`/api/goods/${req.params.goodsname}/${req.query._id}`)//后端跳转
        //res.redirect(req.url);
        return
    }
    //查询列表
    

    let collectionName = req.params.goodsname;//要操作的集合
    let {_page,_limit, _sort, q} = req.query;//默认的参数手动输入
    mgdb.findList({
        collectionName,_page,_limit, _sort, q
    }).then(
        result => res.send(result)
    ).catch(
        err => res.send(err)
    )

})

router.get('/:goodsname/:_id',(req,res,next)=>{
    let collectionName = req.params.goodsname;//获取集合名
    let _id = req.params._id;//获取id
    mgdb.findDetail(
        {collectionName,_id}
    ).then(
        result => res.send(result)
    ).catch(
        err => res.send(err)
    )
})

module.exports = router;