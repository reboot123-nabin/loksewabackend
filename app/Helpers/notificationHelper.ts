import {Notification} from '../models/Notification'

type Meta = {[key : string] : any}

type Notification = {
    title : string,
    message : string,
    uri : string,
    meta ?: Meta,
    user : string
}

export const notify = async (options : Notification) => {
    const notification = new Notification(options)
    await notification.save()
}