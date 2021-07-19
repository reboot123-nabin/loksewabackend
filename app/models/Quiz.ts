import mongoose from 'mongoose'

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

export const Quiz = mongoose.model('Quiz', QuizSchema)