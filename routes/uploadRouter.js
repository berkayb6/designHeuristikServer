const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
var fsExtra= require('fs-extra');
const Heuristics= require('../models/heuristics');
const { v4: uuidv4 } = require('uuid');

let id, name;
var i = 0;
var nameArray = [];
function findLatestHeuristicId(name){
    return new Promise (resolve=> {
        Heuristics.find().sort({ createdAt: -1 }).limit(1)
        .then((heuristic)=> {
            id= heuristic[0]._id.valueOf();
            moveFolderRecursiveSync(`public/assets/${name}`, `public/assets/${id}`)
            resolve(id);
        });
    })
}

function copyFileSync( source, target ) {
    let targetFile;
    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function moveFolderRecursiveSync( source, target ) {
    var files = [];
    // Copy
    if ( !fs.existsSync( target ) ) {
        fs.mkdirSync( target );
    }
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                moveFolderRecursiveSync( curSource, target );
            } else {
                copyFileSync( curSource, target );
            }
        });
    }
    fs.rmSync(source, { recursive: true, force: true });
}

async function store (name) {
    await findLatestHeuristicId(name);
}

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        name = uuidv4();
        console.log("name: ", name)
        nameArray.push(name);
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
    if (nameArray.length!==0){
        store(nameArray[i]);
        i++;
    }
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