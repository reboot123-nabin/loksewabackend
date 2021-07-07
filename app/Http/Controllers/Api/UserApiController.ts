import {Controller} from "../Kernel/Controller";
import {Request, Response} from "express";
import bcrypt from 'bcryptjs'
import { User } from "../../../models/User";
import jsonwebtoken from 'jsonwebtoken'

export class UserApiController extends Controller {
    app_key : string = process.env.APP_KEY || ''
    expiresIn : string = '7d'

    register(request : Request, response : Response) {
        if(!this.validate(request, response)) return;

        const salt = bcrypt.genSaltSync(Number(process.env.SALT || 10))

        const newUser = new User({
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            gender : request.body.gender || null,
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, salt)
        })

        newUser.save().then(async (user: any) => {

            const code = Math.floor(1000 + Math.random() * 9000)
            user.code = 1234 || code
            user.save()

            const token = await jsonwebtoken.sign({data : {id : user.id}}, this.app_key, {expiresIn : this.expiresIn})

            if (process.env.NODE_ENV === 'development') {
                return response.status(201).json({data : user, token})
            }

            return response.status(201).json({token : token, data : user});
        }).catch(function (err) {
            response.status(500).json({ message: err.message })
        })
    }

    login(request : Request, response : Response) {
        if(!this.validate(request, response)) return;

        const expiresIn = request.body.rememberMe ? '30d' : this.expiresIn

        User.findOne({ email: request.body.email }, (err: any, user: any) => {
            if (err) return response.status(500).json({message: err.message})
            if (!bcrypt.compareSync(request.body.password, user.password))
                return response.status(422).json({errors: {email: 'Invalid email address or password'}})
            // if(!user.verifiedAt) return response.status(403).json({message: 'Email is not verified'})

            jsonwebtoken.sign({ data: { id: user.id } }, this.app_key, { expiresIn }, function (err: any, token: any) {
                if (err) return response.status(500).json({message: err.message})

                response.json({ token, user })
            })
        })
    }
}