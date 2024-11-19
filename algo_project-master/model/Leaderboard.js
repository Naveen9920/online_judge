const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
    competitionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Competition', // Assuming you have a Competition model
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    score: {
        type: Number,
        default: 0,
    },
    rank: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);