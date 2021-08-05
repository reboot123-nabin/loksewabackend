import {Request, Response, NextFunction } from "express"
import { FakeMiddleware } from "./FakeMiddleware"
import { TrimString } from "./TrimString"
import {AuthMiddleware} from "./AuthMiddleware";
import { AdminMiddleware } from "./AdminMiddleware";

export abstract class Middleware {
    dependencies = []
    /**
     * @param {*} request
     * @param {*} response
     * @param next
     */
    abstract handle(request : Request, response : Response, next : NextFunction) : void

    /**
     * @return {Function} Function
     * @param middleware
     */
    static resolve(middleware : string) : Function[] {
        let middlewareInstance : Middleware = FakeMiddleware.getInstance()
        switch(middleware) {
            case 'TrimString' : middlewareInstance = TrimString.getInstance()
                break
            case 'Auth' : middlewareInstance = AuthMiddleware.getInstance()
                break;
            case 'Admin' : middlewareInstance = AdminMiddleware.getInstance()
                break;
        }
        const dependencies = middlewareInstance.dependencies.map((middleware : any) => middleware.handle.bind(middleware))
        return [...dependencies, middlewareInstance.handle.bind(middlewareInstance)]
    }
}