import { Controller } from "../Kernel/Controller";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { User } from "../../../models/User";
import jsonwebtoken from 'jsonwebtoken'

export class LoginApiController extends Controller {
    app_key: string = process.env.APP_KEY || ''
    expiresIn: string = '7d'

    register(request: Request, response: Response) {
        if (!this.validate(request, response)) return;

        const salt = bcrypt.genSaltSync(Number(process.env.SALT || 10))

        const newUser = new User({
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            gender: request.body.gender || null,
            email: request.body.email,
            phone: request.body.phone,
            password: bcrypt.hashSync(request.body.password, salt)
        })

        newUser.save().then(async (user: any) => {

            const code = Math.floor(1000 + Math.random() * 9000)
            user.code = 1234 || code
            user.save()

            const token = await jsonwebtoken.sign({ data: { id: user.id } }, this.app_key, { expiresIn: this.expiresIn })

            if (process.env.NODE_ENV === 'development') {
                return response.status(201).json({ data: user, token })
            }

            return response.status(201).json({ token: token, data: user });
        }).catch(function (err) {
            response.status(500).json({ message: err.message })
        })
    }

    login(request: Request, response: Response) {
        if (!this.validate(request, response)) return;

        const expiresIn = request.body.rememberMe ? '30d' : this.expiresIn
        const res = { errors: { email: 'Your login credentials did not match our records.' } };
        let attempted = false;
        const getAccessToken = async (err: any, user: any) => {
            if (!user) {
                if (attempted)
                    return response.status(422).json(res);

                attempted = true;
                return User.findOne({ phone: request.body.email }, getAccessToken);
            }
            if (err) return response.status(500).json({ message: err.message })
            if (!bcrypt.compareSync(request.body.password, user.password))
                return response.status(422).json(res)
            //last login record

            // if(!user.verifiedAt) return response.status(403).json({message: 'Email is not verified'})

            user.last_login = new Date()
            await user.save()

            jsonwebtoken.sign({ data: { id: user.id } }, this.app_key, { expiresIn }, function (err: any, token: any) {
                if (err) return response.status(500).json({ message: err.message })

                response.json({ token, user })
            })
        };
        User.findOne({ email: request.body.email }, getAccessToken)
    }
}