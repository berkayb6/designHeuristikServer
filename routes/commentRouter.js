const express = require('express');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');

const Comments = require('../models/comments');
const { populate } = require('../models/comments');

const commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route('/')

//------------COMMENTS------------
commentRouter.route('/:dishId/comments')

.options((req, res) => {res.sendStatus(200);})

.get( (req,res,next) => {
    Comments.find(req.query)
    .populate('author')
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    if (req.body != null){
        req.body.author = req.user._id;
        Comments.create(req.body)
        .then((comment) => {
            Comments.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode= 200;
                res.setHeader( 'Content-Type', 'application/json');
                res.json(comment);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else{
        err = new Error ('Comment not found in request body');
        err.status= 404;
        return next(err);
    }
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments/');
})
.delete((req, res, next) => {
    Comments.remove({})
    .then((resp) => {
        res.statusCode= 200;
        res.setHeader( 'Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

commentRouter.route('/:commentId')

.options( (req, res) => {res.sendStatus(200);})

.get( (req,res,next) => {
    Comments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null) {
            if (req.user._id.equals(comments.author) == false){
                err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            req.body.author= req.user._id;
            Comments.findByIdAndUpdate(req.params.commentId, {
                $set: req.body
            }, { new: true })
            .then((comment) => {
                Comments.findById(comment._id)
                .populate('author')
                .then((comment)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment);                
                    
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null ) {
            if (req.user._id.equals(comments.author) == false){
                err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            Comments.findByIdAndRemove(req.params.commentId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);                
                           
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports= commentRouter;