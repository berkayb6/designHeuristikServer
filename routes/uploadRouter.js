const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
var fs = require('fs');
const Heuristics= require('../models/heuristics');


function findLatestHeuristicId(){
    let id;
    return new Promise (resolve=> {
        Heuristics.find().sort({ createdAt: -1 }).limit(1).then((heuristic)=> {
            id =  heuristic[0]._id.toString();
            
            console.log("findLatestHeuristicId: ", id)
            resolve(id);
        });

    })
}
async function store () {
    const id = await findLatestHeuristicId();
    console.log("id: ", typeof id)
    
    return id;

}

let id = store();
console.log("id2", typeof id)
const storage =  multer.diskStorage({

    destination: (req, file, cb) => {
        
        console.log("store: ", id[0])
        const path = `public/assets/${id}`
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