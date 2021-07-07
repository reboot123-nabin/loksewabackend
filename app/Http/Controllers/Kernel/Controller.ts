import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BaseController } from "./BaseController";
import {Document} from 'mongoose'


export class Controller extends BaseController{
    validate(request : Request, response : Response) : boolean{
        const v = validationResult(request)
        if(!v.isEmpty()) {
            const errors : {[name : string] : string} = {}
            const validationsErrors = v.array()
            for (let index = 0; index < validationsErrors.length; index++) {
                const error = validationsErrors[index];
                if(error.param in errors) continue
                errors[error.param] = error.msg
            }
            response.status(422).send({errors, message : "Validation failed"}).end()
            return false
        }

        return true
    }

    pagination(request : Request, total : number) {
        const pagination = {
            page : request.body?.pagination?.page || 1,
            perPage : request.body?.pagination?.perPage || 0,
            pages : 1,
            total,
            sort : request.body?.sort?.sort,
            field : request.body?.sort?.field,
            paginate() {
                this.pages = this.perPage && this.total ? Math.ceil(this.total / this.perPage) : 1
                this.page = this.page > this.pages ? this.pages : this.page
            }
        }
        pagination.paginate()
        
        const options : {[key : string] : any} = {}
        if (pagination.perPage) {
            options.limit = pagination.perPage
            options.skip = (pagination.page - 1) * pagination.perPage
        }
        if(request.body?.sort?.field && request.body?.sort?.sort) {
            options.sort = {[request.body.sort.field] : request.body.sort.sort}
        }
        return [pagination, options]
    }
}