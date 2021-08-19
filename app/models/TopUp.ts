import mongoose from 'mongoose'
import {UserInterface} from './User'

export interface TopUpInterface {
    user : UserInterface|string,
    point : number,
    amount : number,
    remarks ?: string,
    status ?: 'new' | 'review' | 'complete' | 'cancelled'
    meta ?: {[key : string] : any}
}

const TopUpSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    point : Number,
    amount : Number,
    remarks : String,
    status : {
        type : String,
        enum : ['new', 'review', 'complete', 'cancelled'],
        default : 'new'
    },
    meta : Object
}, {
    timestamps : true
})

export const TopUp = mongoose.model<TopUpInterface>('TopUp', TopUpSchema)