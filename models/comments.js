const mongoose = require('mongoose');
const Schema= mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 0,
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
    },
    heuristic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Heuristic'
    }
}, {
    usePushEach: true,
    timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);

module.exports= Comments;