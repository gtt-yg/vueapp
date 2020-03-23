var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var multer = require('multer');
var cookieSession = require('cookie-session');


//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//let upload = multer({dest:path.join(__dirname,'public','upload')})
//上传图片分发到不同目录
let storage = multer.diskStorage({
  destination: function(req, file, cb){
    if(req.url.indexOf('user') != -1 || req.url.indexOf('reg') != -1){
      cb(null, path.join(__dirname,'public','upload','user'))
    }else if(req.url.indexOf('banner') != -1 ){
      cb(null, path.join(__dirname,'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname,'public','upload','product'))
    }
  }
})
let upload = multer({storage})
app.use(upload.any());//允许上传图片

//中间件安装设置cookieSession
app.use(cookieSession({
  name:'gtt',
  keys:['aa','bb','cc'],
  maxAge:1000*60*60*24
}))

//静态资源托管--多资源托管
app.use(express.static(path.join(__dirname, 'public','template')));//先匹配用户端
app.use('/admin',express.static(path.join(__dirname, 'public','admin')));//用别名来匹配管理端
app.use(express.static(path.join(__dirname, 'public')));//前面匹配不到退出到publc匹配，


//接口响应

//用户端
app.all('/api/*',require('./routes/api/params'))//处理API下发的所有接口的公共参数
app.use('/api/goods',require('./routes/api/goods'))//处理home,banner等公共的事物
app.use('/api/reg',require('./routes/api/reg'))
app.use('/api/login',require('./routes/api/login'))

app.use('/api/user',require('./routes/api/user'))
app.use('/api/logout',require('./routes/api/logout'))


// app.use('/api/home',require('./routes/api/home'))
// app.use('/api/follow',require('./routes/api/follow'))
// app.use('/api/column',require('./routes/api/column'))
// app.use('/api/banner',require('./routes/api/banner'))

//管理端

/* app.use('/admin/banner',require('./routes/admin/banner'))
app.use('/admin/home',require('./routes/admin/home'))
app.use('/admin/movies',require('./routes/admin/movies'))
app.use('/admin/follow',require('./routes/admin/follow'))
app.use('/admin/hot',require('./routes/admin/hot'))
 */




// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//app.use('/api/product', require('./routes/test'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(req.url.includes('/api')){//用户端接口不存在，返回{err:1,msg:'不存在的接口'}
    res.send({err:1,msg:'不存在的接口'})
  }else if(req.url.includes('/admin')){//管理端接口不存在，返回res.render('error.ejs')
    res.render('error');
  }else{//资源托管没有对应页面，返回404.html
    res.sendFile(path.join(__dirname,'public','template','404.html'))
  }
  
  
  
  
});

module.exports = app;
