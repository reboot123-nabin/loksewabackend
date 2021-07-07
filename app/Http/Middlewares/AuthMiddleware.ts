import {Response, Request, NextFunction} from "express"
import {Middleware} from './AbstractMiddleware';
import jwt from "jsonwebtoken"
import {User} from "../../models/User";
import {Document} from "mongoose";

interface Decoded {
    data: { id: string }
}

export class AuthMiddleware extends Middleware {
    app_key : string = process.env.APP_KEY || 'basantashubhu'
    
    handle(request : Request, response : Response, next : NextFunction)  {
        const tokenVerifier = this.verifyNext(request, response, next)
        if(request.cookies.token) {
            tokenVerifier.token(request.cookies.token)
        } else if (!request.headers.authorization) {
            tokenVerifier.error()
        }  else {
            const token = request.headers.authorization.replace('Bearer ', '')
            tokenVerifier.token(token)
        }
    }

    verifyNext(request : Request, response : Response, next : Function) {
        return {
            app_key : this.app_key,
            token(token : string) {
                jwt.verify(token, this.app_key, (err : any, decoded : any ) => {
                    if (err) return this.error(err.message)
                    request.decoded = decoded
                    this.auth(decoded)
                        .catch(err => this.error(err.message))
                        .then(() => next())
                })
            },
            async auth(decoded : Decoded) {
                const user : Document|null = await User.findById(decoded.data.id)
                request.auth = {
                    user(key : string|null = null) {
                        if (user === null) return null;
                        if (!key) return user;
                        return user.get(key)
                    },
                    id() {
                        if (user === null) return null;
                        return user.id
                    }
                }
            },
            error(message : string|null = null) {
                response.status(401).send({message: `Please login to continue.. ${message ? `reason: ${message}` : ''}`})
            }
        }
    }
}