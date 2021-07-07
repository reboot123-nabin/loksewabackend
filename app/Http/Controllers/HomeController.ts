import {Request, Response} from "express"
import { Controller } from "./Kernel/Controller"
import fs from 'fs'
import path from 'path'

export class HomeController extends Controller{
    constructor() {
        super()
    }

    index(request : Request, response : Response) {
        response.render('index')
    }

    /**
     * @route /file/:id
     * file response
     * @param request 
     * @param response 
     */
    async responseFile(request : Request, response : Response) {
        const filePath = path.join(process.cwd(), request.params.filename)
        if (fs.existsSync(filePath)) {
            return response.sendFile(filePath)
        }
        response.status(404).json({message : 'File not found'})
    }
}