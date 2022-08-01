const express= require('express');
const bodyParser= require('body-parser');

const authenticate= require('../authenticate');

const cors = require('./cors');

const Heuristics= require('../models/heuristics');

const heuristicRouter= express.Router();
heuristicRouter.use(bodyParser.json());

//------------HEURISTICS------------
heuristicRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req,res,next) => {
    Heuristics.find({})
    .populate('comments.author')
    .then((heuristics) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(heuristics);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Heuristics.create(req.body)
    .then((heuristic) => {
        console.log('Heuristic Created ', heuristic);
        res.statusCode= 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(heuristic);
    }, (err)=> next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /heuristics');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Heuristics.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

//------------HEURISTIC------------

heuristicRouter.route('/:heuristicId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req,res,next) => {
    Heuristics.findById(req.params.heuristicId)
    .populate('comments.author')
    .then((heuristic) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(heuristic);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /heuristics/'+ req.params.heuristicId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Heuristics.findByIdAndUpdate(req.params.heuristicId, {
        $set: req.body
    }, { new: true })
    .then((heuristic) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(heuristic);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Heuristics.findByIdAndRemove(req.params.heuristicId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

//------------COMMENTS------------

heuristicRouter.route('/:heuristicId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req,res,next) => {
    Heuristics.findById(req.params.heuristicId)
    .populate('comments.author')
    .then((heuristic) => {
        if (heuristic != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(heuristic.comments);
        }
        else {
            err = new Error('heuristic ' + req.params.heuristicId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null) {
            req.body.author = req.user._id;
            heuristic.comments.push(req.body);
            heuristic.save()
            .then((heuristic) => {
                Heuristics.findById(heuristic._id)
                .populate('comments.author')
                .then((heuristic) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(heuristic);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('heuristic ' + req.params.heuristicId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Heuristics/'
        + req.params.heuristicId + '/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null) {
            for (var i = (heuristic.comments.length -1); i >= 0; i--) {
                heuristic.comments.id(heuristic.comments[i]._id).remove();
            }
            heuristic.save()
            .then((heuristic) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(heuristic);                
            }, (err) => next(err));
        }
        else {
            err = new Error('heuristic ' + req.params.heuristicId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

//------------COMMENT------------

heuristicRouter.route('/:heuristicId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req,res,next) => {
    Heuristics.findById(req.params.heuristicId)
    .populate('comments.author')    
    .then((heuristic) => {
        if (heuristic != null && heuristic.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(heuristic.comments.id(req.params.commentId));
        }
        else if (heuristic == null) {
            err = new Error('Heuristic ' + req.params.heuristicId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Heuristics/'+ req.params.heuristicId
        + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null && heuristic.comments.id(req.params.commentId) != null && req.user._id.equals(heuristic.comments.id(req.params.commentId).author)) {
            if (req.body.rating) {
                heuristic.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment ) {
                heuristic.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            heuristic.save()
            .then((heuristic) => {
                Heuristics.findById(heuristic._id)
                .populate('comments.author')
                .then((heuristic)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(heuristic);                
                    
                })
            }, (err) => next(err));
        }
        else if (req.user._id.equals(heuristic.comments.id(req.params.commentId).author) == false){
            err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        else if (heuristic == null) {
            err = new Error('Heuristic ' + req.params.heuristicId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null && heuristic.comments.id(req.params.commentId) != null && req.user._id.equals(heuristic.comments.id(req.params.commentId).author)) {
            heuristic.comments.id(req.params.commentId).remove();
            heuristic.save()
            .then((heuristic) => {
                Heuristics.findById(heuristic._id)
                .populate('comments.author')
                .then((heuristic)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(heuristic);                
                })             
            }, (err) => next(err));
        }
        else if (req.user._id.equals(heuristic.comments.id(req.params.commentId).author) == false){
            err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        else if (heuristic == null) {
            err = new Error('Heuristic ' + req.params.heuristicId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports= heuristicRouter;