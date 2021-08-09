import mongoose from 'mongoose'
import {QuestionInterface} from './Question'
import {UserInterface} from './User'

export interface QuizInterface extends mongoose.Document{
    id : mongoose.Types.ObjectId,
    title : string,
    category : string,
    difficulty : string,
    points ?: number,
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
        points : Number,
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

QuizSchema.virtual('attempts', {
    ref: 'Attempt', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'quiz', // is equal to foreignField
});

// Set Object and Json property to true. Default is set to false
QuizSchema.set('toObject', { virtuals : true });
QuizSchema.set('toJSON', { virtuals: true });

export const Quiz = mongoose.model<QuizInterface>('Quiz', QuizSchema)