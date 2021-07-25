import mongoose from 'mongoose'

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
        correct : Boolean,
        answers : [
            {
                question : {
                    type : mongoose.Types.ObjectId,
                    ref : 'Question'
                },
                answer : mongoose.Types.ObjectId
            }
        ]
    }, 
    {
        timestamps : true,
    }
);

export const Attempt = mongoose.model('Attempt', AttemptSchema)