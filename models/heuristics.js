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
    shortId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    orderArtefact: {
        type: String,
        required: true
    },
    embodimentArtefact: {
        type: String,
        required: true
    },
    embodimentAtrribute: {
        type: String
    },
    orderAttribute: {
        type: String
    },
    adressedSystemLevel: {
        type: String,
        required: true
    },
    artefactCategorization: {
        type: String,
        required: true
    },
    orderCategory: {
        type: String,
        required: true
    },
    orderCategorySpecification: {
        type: String,
        required: true
    },
    positiveEffects:{
        type: Array,
        required: true
    },
    negativeEffects:{
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