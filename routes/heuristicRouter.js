const express= require('express');
const bodyParser= require('body-parser');
/**
const authenticate= require('../authenticate');
const cors = require('./cors');
*/

const Heuristics= require('../models/heuristics');

const heuristicRouter= express.Router();
heuristicRouter.use(bodyParser.json());

//------------HEURISTICS------------
heuristicRouter.route('/')


.get((req,res,next)=>{
    Heuristics.find({})
    .then((heuristics) => {
        res.statusCode= 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(heuristics);
    }, (err)=> next(err))
    .catch((err) => next(err));
})

.post( (req,res,next) => {
    Heuristics.create(req.body)
    .then((heuristic) => {
        console.log('Heuristic Created ', heuristic);
        res.statusCode= 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(heuristic);
    }, (err)=> next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /heuristics');
})
.delete((req, res, next) => {
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
.get((req,res,next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(heuristic);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /heuristics/'+ req.params.heuristicId);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
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
.get((req,res,next) => {
    Heuristics.findById(req.params.heuristicId)
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
.post((req, res, next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null) {
            heuristic.comments.push(req.body);
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
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Heuristics/'
        + req.params.heuristicId + '/comments');
})
.delete((req, res, next) => {
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
.get((req,res,next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null && heuristic.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(heuristic.comments.id(req.params.commentId));
        }
        else if (heuristic == null) {
            err = new Error('heuristic ' + req.params.heuristicId + ' not found');
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
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Heuristics/'+ req.params.heuristicId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null && heuristic.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                heuristic.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                heuristic.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            heuristic.save()
            .then((heuristic) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(heuristic);                
            }, (err) => next(err));
        }
        else if (heuristic == null) {
            err = new Error('heuristic ' + req.params.heuristicId + ' not found');
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
.delete((req, res, next) => {
    Heuristics.findById(req.params.heuristicId)
    .then((heuristic) => {
        if (heuristic != null && heuristic.comments.id(req.params.commentId) != null) {
            heuristic.comments.id(req.params.commentId).remove();
            heuristic.save()
            .then((heuristic) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(heuristic);                
            }, (err) => next(err));
        }
        else if (heuristic == null) {
            err = new Error('heuristic ' + req.params.heuristicId + ' not found');
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