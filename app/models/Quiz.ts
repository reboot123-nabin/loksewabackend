import mongoose from 'mongoose'
import {QuestionInterface} from './Question'
import {UserInterface} from './User'

export interface QuizInterface extends mongoose.Document{
    id : mongoose.Types.ObjectId,
    title : string,
    category : string,
    difficulty : string,
    count : number,
    questions : QuestionInterface[],
    user ?: UserInterface
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
        },
        user : {
            type : mongoose.Types.ObjectId,
            ref : 'User'
        }
    },
    {
        timestamps : true,
    }
);

export const Quiz = mongoose.model<QuizInterface>('Quiz', QuizSchema)