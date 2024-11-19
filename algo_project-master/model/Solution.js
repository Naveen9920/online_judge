const mongoose =require('mongoose');
const SolutionSchema= new mongoose.Schema({
    problemId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Problem',
    },
    code:{
            type: String,
            required: true,

    },



});
module.exports=mongoose.model('Solution',SolutionSchema);
