import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema(
    {
        label : String,
        category : String,
        difficulty : {
            type : String,
            enum : ['Easy', 'Medium', 'Hard'],
            defaultValue : 'Easy',
        },
        options : [{value : String, is_correct : Boolean}]
    }, 
    {
        timestamps : true,
    }
);

export const Question = mongoose.model('Question', QuestionSchema)