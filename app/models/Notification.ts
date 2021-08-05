import mongoose from "mongoose";

type Meta = {[key : string] : any}

export interface NotificationInterface{
    title : string,
    message : string,
    uri : string,
    meta ?: Meta,
    read ?: boolean,
    read_at ?: Date,
    user : string
}

const NotificationSchema = new mongoose.Schema({
    title : String,
    message : String,
    uri : String,
    meta : JSON,
    read : {
        type : Boolean,
        default : false
    },
    read_at : Date,
    user : { type : mongoose.Types.ObjectId, ref : 'User' }
}, {
    timestamps : true
})

export const Notification = mongoose.model<NotificationInterface>('Notification', NotificationSchema)