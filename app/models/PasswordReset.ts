import mongoose from 'mongoose'
import { UserInterface } from './User'

export interface PasswordResetInterface {
    id : string,
    user : UserInterface|string,
    reset_token : string,
    reset_code : number,
    validity : Date
}

const PasswordResetSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    reset_token : String,
    reset_code : Number,
    validity : Date,
}, {
    timestamps : true
})

export const PasswordReset = mongoose.model<PasswordResetInterface>('PasswordReset', PasswordResetSchema)