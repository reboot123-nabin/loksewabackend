import mongoose from 'mongoose'
import random from 'mongoose-simple-random'

export type Options = {value : string, is_correct : boolean, id : string}

export interface QuestionInterface extends mongoose.Document{
    label : string,
    category : string,
    difficulty : string,
    options ?: Options[]
}

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
export const Question = mongoose.model<QuestionInterface>('Question', QuestionSchema)