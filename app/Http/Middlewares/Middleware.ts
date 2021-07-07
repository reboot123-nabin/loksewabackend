import {Request, Response, NextFunction } from "express"
import { FakeMiddleware } from "./FakeMiddleware"
import { TrimString } from "./TrimString"
import {AuthMiddleware} from "./AuthMiddleware";

export abstract class Middleware {
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
    static resolve(middleware : string) : Function {
        let middlewareInstance : Middleware = FakeMiddleware.getInstance()
        switch(middleware) {
            case 'TrimString' : middlewareInstance = TrimString.getInstance()
                break
            case 'Auth' : middlewareInstance = AuthMiddleware.getInstance()
        }
        return middlewareInstance.handle.bind(middlewareInstance)
    }
}