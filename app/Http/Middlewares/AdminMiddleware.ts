import {Response, Request, NextFunction} from "express"
import {Middleware} from './AbstractMiddleware';
import { AuthMiddleware } from "./AuthMiddleware";

export class AdminMiddleware extends Middleware {
    constructor() {
        super()
        this.dependencies = [AuthMiddleware.getInstance()]
    }

    handle(request : Request, response : Response, next : NextFunction)  {
        if(request.auth?.user('userType') !== 'admin') {
            return response.status(401).json({message : 'Unauthorized request'})
        }
        next();
    }
}