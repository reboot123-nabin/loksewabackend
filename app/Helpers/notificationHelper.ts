import {Notification, NotificationInterface} from '../models/Notification'

export const notify = async (options : NotificationInterface) => {
    const notification = new Notification({...options, read:false})
    await notification.save()
}