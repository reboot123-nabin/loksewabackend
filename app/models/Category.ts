import mongoose from 'mongoose'

const CategotySchema = new mongoose.Schema(
    {
        name : String,
        image : {
            type : mongoose.Types.ObjectId,
            ref : 'File'
        }
    }, 
    {
        timestamps : true,
    }
);

export const Category = mongoose.model('Category', CategotySchema)