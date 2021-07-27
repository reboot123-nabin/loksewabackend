import mongoose from 'mongoose'
import {QuestionInterface} from './Question'

export interface QuizInterface extends mongoose.Document{
    id : mongoose.Types.ObjectId,
    title : string,
    category : string,
    difficulty : string,
    count : number,
    questions : QuestionInterface[]
}

const QuizSchema = new mongoose.Schema(
    {
        title : String,
        category : String,
        difficulty : String,
        count : Number,
        questions : {
            type : [mongoose.Types.ObjectId],
            ref : 'Question'
        }
    },
    {
        timestamps : true,
    }
);

export const Quiz = mongoose.model<QuizInterface>('Quiz', QuizSchema)