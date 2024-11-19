const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema({
    input: { 
        type: String, 
        required: true 
            },
    output: { 
        type: String, 
        required: true 
    },
});

const ProblemSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    testCases: [TestCaseSchema],
    
});
module.exports = mongoose.model("Problem", ProblemSchema);