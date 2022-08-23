const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
var fs = require('fs');
const Heuristics= require('../models/heuristics');
const { v4: uuidv4 } = require('uuid');

let id, name;
var ObjectId = require('mongodb').ObjectId;
function findLatestHeuristicId(name){
    let latestHeuristicId;
    return new Promise (resolve=> {
        Heuristics.find().sort({ createdAt: -1 }).limit(1)
       
        .then((heuristic)=> {
            latestHeuristicId =  heuristic[0]._id;
            id= latestHeuristicId.valueOf();
            fs.rename(`public/assets/${name}`, `public/assets/${id}`, (err)=> {
                if (err) throw err;    
            })
            resolve(id);
        });

    })
}

async function store (name) {
    await findLatestHeuristicId(name);
}

const storage =  multer.diskStorage({

    destination: (req, file, cb) => {
        name = uuidv4();
        const path = `public/assets/${name}`
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
    },

    filename: (req, file, cb) => {        
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post( upload.single('imageFile'), (req, res) => {
    store(name);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;