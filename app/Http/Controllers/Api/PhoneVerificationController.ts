import { Request, Response } from "express";
import {Controller} from "../Kernel/Controller";
import axios from 'axios'
import queryString from 'querystring'

export class PhoneVerificationController extends Controller {
    generateCode(request : Request, response : Response) {
        if(!this.validate(request, response)) return;
        const APP_KEY = process.env.RINGCAPTCHA_APP_KEY
        const service = request.params.service
        axios.post(`https://api.ringcaptcha.com/${APP_KEY}/code/${service}`, queryString.stringify({
            phone : request.body.phone,
            api_key : process.env.RINGCAPTCHA_API_KEY,
            locale : 'en'
        }), {
            headers : {
                "Content-Type" : "application/x-www-url-encoded; charset=utf-8"
            }
        }).then((res : any) => {
            if(res.data.status === 'ERROR') return response.status(500).json({message : res.data.message})
            response.status(201).json(res.data)
        }).catch((err : Error) => response.status(500).json({message : err.message}))
    }

    verify(request : Request, response : Response) {
        if(!this.validate(request, response)) return;
        const APP_KEY = process.env.RINGCAPTCHA_APP_KEY
        axios.post(`https://api.ringcaptcha.com/${APP_KEY}/verify`, queryString.stringify({
            phone : request.body.phone,
            code : request.body.code,
            api_key : process.env.RINGCAPTCHA_API_KEY,
        }), {
            headers : {
                "Content-Type" : "application/x-www-url-encoded; charset=utf-8"
            }
        }).then((res : any) => {
            if(res.data.status === 'ERROR') return response.status(500).json({message : res.data.message})
            response.json(res.data)
        }).catch((err : Error) => response.status(500).json({message : err.message}))
    }
}