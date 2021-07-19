import mongoose from 'mongoose'
import random from 'mongoose-simple-random'

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
QuestionSchema.plugin(random)
export const Question = mongoose.model('Question', QuestionSchema)