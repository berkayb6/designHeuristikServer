const mongoose = require('mongoose');
const Schema= mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5
        //required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var heuristicSchema = new Schema({
    designFor: {
        type: Array,
        required: true
    },
    positiveInfluence:{
        type: Array,
        required: true
    },
    designPhase: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    negativeInfluence:{
        type: Array
    },
    lifeCyclePhase: {
        type: Array
    },
    industry: {
        type: Array
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    name: {
        type: String
        //required: true
    },
    category: {
        type: Array  
    },
    description:{
        type: String
    },
    image:{
        type: Array
        //required: true
    },
    sources:{
        type: Array
    },
    comments:[commentSchema]
}, {
    usePushEach: true,
    timestamps: true
});

var Heuristics= mongoose.model('Heuristic', heuristicSchema);

module.exports= Heuristics;