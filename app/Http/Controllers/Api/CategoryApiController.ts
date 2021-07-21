import { Request, Response } from "express";
import { Category } from "../../../models/Category";
import { Controller } from "../Kernel/Controller";

export class CategoryApiController extends Controller {

    async getAll(request : Request, response : Response) {
        const results = await Category.find({})
        response.json(results)
    }

}