var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport= require('passport');
var authenticate= require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var heuristicRouter= require('./routes/heuristicRouter');
const uploadRouter = require('./routes/uploadRouter');
var commentRouter= require('./routes/commentRouter');

const mongoose= require('mongoose');

const url= config.mongoUrl;
const connect= mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected correctly to server');

}, (err)=> {console.log(err);
});

var app = express();

app.all('*', (req, res, next)=> {
  if (req.secure) {
    return next();
  }
  else{
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  //Origin, X-Requested-With, Content-Type, Accept
  next();
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));

// function waitForHeuristic(){
//   const result = app.use('/heuristics', heuristicRouter);
//   return new Promise (resolve=> {
//       resolve(result);
//   })
// }

// let res;
// async function upload () {
//   res = await waitForHeuristic();
//   console.log("result: ", res);
  
// }

app.use('/heuristics', heuristicRouter);
app.use('/imageUpload',uploadRouter); 
app.use('/comments', commentRouter);

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
  res.render('error');
});

module.exports = app;
