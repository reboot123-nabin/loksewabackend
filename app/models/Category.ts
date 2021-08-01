import mongoose from 'mongoose'

export interface CategoryInterface {
    name : string,
    image : string
}

const CategorySchema = new mongoose.Schema(
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

export const Category = mongoose.model<CategoryInterface>('Category', CategorySchema)