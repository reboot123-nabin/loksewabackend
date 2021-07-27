import {Controller} from '../Kernel/Controller'
import {Request, Response} from 'express'
import {Notification} from '../../../models/Notification'

export class NotificationApiController extends Controller {
    constructor() {
        super();
        this.middleware('Auth')
    }

    async getAll(request : Request, response : Response) {
        const options = {
            user : request.auth?.id()
        }
        if (typeof request.body?.read === 'number') {
            Object.assign(options, {read : !!request.body?.read})
        }
        const notifications = await Notification.find(options, null, {
            limit : 10, skip : ((request.body?.page || 1) - 1) * 10
        })
        const total = await Notification.find(options).estimatedDocumentCount()
        response.json({
            meta : {
                read : !!request.body?.read,
                page : request.body?.page || 1,
                total
            },
            data : notifications
        })
    }

}