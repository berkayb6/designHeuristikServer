const mongoose = require('mongoose');
const Schema= mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
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
    designfor: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    positiveInfluence:{
        type: Array,
        required: true
    },
    negativeInfluence:{
        type: Array,
        required: true
    },
    applicableIndustry:{
        type: Array,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    sources:{
        type: String,
        required: true
    },
    comments:[commentSchema]
}, {
    usePushEach: true,
    timestamps: true
});

var Heuristics= mongoose.model('Heuristic', heuristicSchema);

module.exports= Heuristics;