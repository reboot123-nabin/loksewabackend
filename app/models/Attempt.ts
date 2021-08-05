import mongoose from 'mongoose'
import {QuizInterface} from './Quiz'


interface Answer{
    question : string,
    answer : string,
    correct : boolean
}

export interface AttemptInterface extends mongoose.Document{
    quiz : QuizInterface|string,
    user : string,
    answers : Answer[],
    completed ?: boolean
}

const AttemptSchema = new mongoose.Schema(
    {
        quiz : {
            type : mongoose.Types.ObjectId,
            ref : 'Quiz'
        },
        user : {
            type : mongoose.Types.ObjectId,
            ref : 'User'
        },
        completed : {
            type : Boolean,
            default : true
        },
        answers : [
            {
                question : {
                    type : mongoose.Types.ObjectId,
                    ref : 'Question'
                },
                answer : mongoose.Types.ObjectId,
                correct : Boolean
            }
        ]
    }, 
    {
        timestamps : true,
    }
);

export const Attempt = mongoose.model<AttemptInterface>('Attempt', AttemptSchema)