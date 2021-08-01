import mongoose from 'mongoose'
import {UserInterface} from './User'

export interface RewardPointInterface {
    user : UserInterface|string,
    point : number,
    remarks : string,
    meta : {[key : string] : any}
}

const RewardPointSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    point : Number,
    remarks : String,
    meta : Object
}, {
    timestamps : true
})

export const RewardPoint = mongoose.model<RewardPointInterface>('RewardPoint', RewardPointSchema)