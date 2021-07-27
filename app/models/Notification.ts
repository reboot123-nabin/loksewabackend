import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title : String,
    message : String,
    uri : String,
    meta : JSON,
    read : {
        type : Boolean,
        defaultValue : false
    },
    user : { type : mongoose.Types.ObjectId, ref : 'User' }
}, {
    timestamps : true
})

export const Notification = mongoose.model('Notification', NotificationSchema)