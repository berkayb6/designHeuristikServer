var express = require('express');
const userRouter = express.Router();

const bodyParser = require('body-parser');
var User = require('../models/user');

var authenticate = require('../authenticate');
const cors = require('./cors');
var passport= require('passport');

userRouter.use(bodyParser.json());

userRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )

userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  User.find({})
  .then((users) => {
      res.statusCode= 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  }, (err)=> next(err))
  .catch((err) => next(err))
})



.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if (req.body.subscription)
        user.subscription = req.body.subscription;
      
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
})

.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info });
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: "Could not log in user" });    
      }
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token });
    });
  }) (req, res, next);
})


.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

userRouter.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

userRouter.route('/:userId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req,res,next) => {
    User.findById(req.params.userId)
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = userRouter;
